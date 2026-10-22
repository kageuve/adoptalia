#!/usr/bin/env python3
"""Deployment and recovery tools. No shell sourcing of .env; never print secrets."""
import argparse
import datetime
import fcntl
import gzip
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time

ROOT = Path(__file__).resolve().parent.parent
ENV = Path(os.environ.get('ADOPTALIA_ENV_FILE', str(ROOT / '.env'))).resolve()
BASE = ['docker', 'compose', '--env-file', str(ENV), '-f', str(ROOT / 'compose.yaml')]
OVERRIDE = ROOT / '.restore-images.json'


def run(args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def compose(*args, override=True, **kwargs):
    cmd = BASE[:]
    if override and OVERRIDE.exists():
        cmd += ['-f', str(OVERRIDE)]
    return run(cmd + list(args), **kwargs)


def config():
    return json.loads(compose('config', '--format', 'json', capture_output=True, text=True).stdout)


def mount_source(cfg, service, target):
    mounts = cfg['services'][service].get('volumes', [])
    return Path(next(m['source'] for m in mounts if m['target'] == target)).resolve()


def prepare(cfg):
    uploads = mount_source(cfg, 'backend', '/app/public/uploads')
    uploads.mkdir(parents=True, exist_ok=True)
    for p in [uploads, uploads / 'imagenes', uploads / 'perfiles']:
        p.mkdir(exist_ok=True)
        if os.geteuid() == 0:
            os.chown(p, 1000, 1000)
        p.chmod(0o755)
    data = mount_source(cfg, 'db', '/var/lib/mysql')
    data.mkdir(parents=True, exist_ok=True)
    if uploads == data or data in uploads.parents or uploads in data.parents:
        raise RuntimeError('Database and uploads directories must not overlap')


def sql(statement=None, *, infile=None):
    # Credentials expanded only inside the container, never on host command lines.
    cmd = ['exec', '-T', 'db', 'sh', '-c', 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql --batch --skip-column-names -uroot "$MYSQL_DATABASE"']
    if infile is not None:
        command = BASE[:]
        if OVERRIDE.exists(): command += ['-f', str(OVERRIDE)]
        proc = subprocess.Popen(command + cmd, stdin=subprocess.PIPE)
        try:
            shutil.copyfileobj(infile, proc.stdin)
        finally:
            proc.stdin.close()
        if proc.wait(): raise RuntimeError('SQL import failed')
        return
    return compose(*cmd, input=statement, text=True, capture_output=True).stdout.strip()


def migrate():
    sql('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(150) PRIMARY KEY, checksum CHAR(64) NOT NULL, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);')
    for p in sorted((ROOT / 'db/migrations').glob('*.sql')):
        name = p.name
        if not all(c.isalnum() or c in '._-' for c in name):
            raise RuntimeError('Invalid migration filename')
        checksum = hashlib.sha256(p.read_bytes()).hexdigest()
        previous = sql(f"SELECT checksum FROM schema_migrations WHERE version='{name}';")
        if previous:
            if previous != checksum:
                raise RuntimeError(f'Applied migration changed: {name}')
            continue
        # DDL auto-commits in MySQL. Migrations must be restart-safe, never edited after application.
        sql(p.read_text() + f"\nINSERT INTO schema_migrations(version,checksum) VALUES ('{name}','{checksum}');")
        print('Applied migration:', name)


def verify():
    compose('ps')
    compose('exec', '-T', 'backend', 'node', '-e', "fetch('http://127.0.0.1:3000/api/health/ready').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))")
    for path in ['/', '/api/health/ready', '/api/animales/publicos', '/api/protectoras/publicas', '/api/usuarios/impacto']:
        compose('exec', '-T', 'frontend', 'wget', '-q', '-O', '/dev/null', 'http://127.0.0.1:8080' + path)
    print('Web, proxy, API and database OK. Also verify browser login and business flows.')


def validate_environment(cfg):
    env = cfg['services']['db']['environment']
    secrets = [env['MYSQL_ROOT_PASSWORD'], env['MYSQL_PASSWORD'], cfg['services']['backend']['environment']['JWT_SECRET']]
    if any(not v or v.startswith('CHANGE_ME') for v in secrets):
        raise RuntimeError('Replace fictitious secrets in .env')
    if len(secrets[2]) < 32:
        raise RuntimeError('JWT_SECRET must have at least 32 characters')
    if secrets[0] == secrets[1]:
        raise RuntimeError('Database root and application passwords must differ')
    if ENV.stat().st_mode & 0o077:
        raise RuntimeError(f'{ENV} must have mode 600 (chmod 600)')


def deploy(args):
    if OVERRIDE.exists() and args.from_source:
        OVERRIDE.unlink()
    cfg = config()
    validate_environment(cfg)
    prepare(cfg)
    services = args.services or ['backend', 'frontend']
    if args.build:
        if OVERRIDE.exists():
            raise RuntimeError('Restored images active. Use --from-source to rebuild the repository version.')
        # Sequential builds avoid exhausting memory on small hosts.
        for service in services:
            if service in ['backend', 'frontend']:
                compose('build', service)
    compose('up', '-d', '--wait', '--wait-timeout', '600', 'db')
    migrate()
    compose('up', '-d', '--no-build', '--wait', '--wait-timeout', '600')
    verify()


def sha256(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def backup(args):
    cfg = config()
    parent = Path(args.directory).resolve()
    data = mount_source(cfg, 'db', '/var/lib/mysql')
    uploads = mount_source(cfg, 'backend', '/app/public/uploads')
    if data == parent or data in parent.parents or uploads == parent or uploads in parent.parents:
        raise RuntimeError('Backup destination cannot be inside application data')
    parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    now = datetime.datetime.now(datetime.timezone.utc)
    dest = parent / (now.strftime('adoptalia-%Y%m%dT%H%M%SZ') + '.partial')
    dest.mkdir(mode=0o700)
    active = compose('ps', '--services', '--status', 'running', capture_output=True, text=True).stdout.split()
    writers = [s for s in active if s in ['frontend', 'backend', 'phpmyadmin']]
    if 'db' not in active:
        raise RuntimeError('Database must be running')
    print('Stopping web/API/admin briefly for a consistent database + uploads snapshot.')
    try:
        if writers:
            compose('stop', *writers)
        with tempfile.TemporaryDirectory(dir=dest) as temp:
            container = compose('ps', '-a', '-q', 'backend', capture_output=True, text=True).stdout.strip()
            if not container:
                raise RuntimeError('Backend container missing: cannot capture uploads')
            run(['docker', 'cp', container + ':/app/public/uploads', temp + '/uploads'])
            with tarfile.open(dest / 'uploads.tar.gz', 'w:gz') as tar:
                tar.add(temp + '/uploads', arcname='uploads')
        with (dest / 'database.sql.gz').open('wb') as out:
            dump = subprocess.Popen(BASE + ['exec', '-T', 'db', 'sh', '-c', 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysqldump -uroot --single-transaction --quick --routines --events --triggers --hex-blob --no-tablespaces --set-gtid-purged=OFF --default-character-set=utf8mb4 "$MYSQL_DATABASE"'], stdout=subprocess.PIPE)
            with gzip.GzipFile(fileobj=out, mode='wb') as gz:
                shutil.copyfileobj(dump.stdout, gz)
            dump.stdout.close()
            if dump.wait():
                raise RuntimeError('Database dump failed')
        with tarfile.open(dest / 'project.tar.gz', 'w:gz') as tar:
            def exclude(info):
                parts = Path(info.name).parts
                if any(x in parts for x in ['node_modules', '.git', '.angular', 'dist', 'backups', 'data', '.claude']):
                    return None
                if info.name == 'project/.env':
                    return None
                if info.name.startswith('project/db/mysql') or info.name.startswith('project/backend/public/uploads'):
                    return None
                try:
                    real = ROOT.joinpath(*parts[1:]).resolve()
                    if real == data or data in real.parents or real == uploads or uploads in real.parents:
                        return None
                    if real == parent or parent in real.parents:
                        return None
                except OSError:
                    return None
                return info
            tar.add(ROOT, arcname='project', filter=exclude)
            tar.add(ENV, arcname='project/.env')
        # Record exactly the running image IDs, not the current mutable tag targets.
        images = {}
        for service in cfg['services']:
            cid = compose('ps', '-a', '-q', service, capture_output=True, text=True).stdout.strip()
            if not cid:
                continue
            info = json.loads(run(['docker', 'inspect', cid], capture_output=True, text=True).stdout)[0]
            image_id = info['Image']
            tag = f"adoptalia-recovery/{service}:{image_id.split(':')[1][:16]}"
            run(['docker', 'image', 'tag', image_id, tag])
            images[service] = {'tag': tag, 'id': image_id}
        try:
            commit = run(['git', '-C', str(ROOT), 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
        except subprocess.CalledProcessError:
            commit = None
        meta = {'format': 1, 'created_utc': now.isoformat(), 'images': images, 'git_commit': commit, 'database': cfg['services']['db']['environment']['MYSQL_DATABASE'], 'architecture': run(['docker', 'info', '--format', '{{.Architecture}}'], capture_output=True, text=True).stdout.strip()}
        (dest / 'metadata.json').write_text(json.dumps(meta, indent=2) + '\n')
    finally:
        if writers:
            compose('start', *writers)
    # Compression runs after services resume, reducing downtime.
    if not args.no_images:
        with (dest / 'images.tar.gz').open('wb') as out:
            proc = subprocess.Popen(['docker', 'image', 'save', *[x['tag'] for x in images.values()]], stdout=subprocess.PIPE)
            with gzip.GzipFile(fileobj=out, mode='wb', compresslevel=1) as gz:
                shutil.copyfileobj(proc.stdout, gz)
            proc.stdout.close()
            if proc.wait():
                raise RuntimeError('Image export failed')
    (dest / 'SHA256SUMS').write_text(''.join(f'{sha256(p)}  {p.name}\n' for p in sorted(dest.iterdir()) if p.is_file()))
    for p in dest.iterdir():
        if p.is_file():
            p.chmod(0o600)
    finished = Path(str(dest).removesuffix('.partial'))
    dest.rename(finished)
    print('Backup complete (contains secrets; store encrypted and off-host):', finished)


def validate_backup(directory):
    if directory.name.endswith('.partial'):
        raise RuntimeError('Incomplete backup')
    entries = {}
    for line in (directory / 'SHA256SUMS').read_text().splitlines():
        expected, name = line.split('  ', 1)
        if '/' in name or name in ['.', '..']:
            raise RuntimeError('Invalid checksum path')
        p = directory / name
        if p.is_symlink() or not p.is_file() or sha256(p) != expected:
            raise RuntimeError('Backup verification failed: ' + name)
        entries[name] = expected
    for name in ['database.sql.gz', 'uploads.tar.gz', 'project.tar.gz', 'metadata.json']:
        if name not in entries:
            raise RuntimeError('Missing backup file: ' + name)
    return json.loads((directory / 'metadata.json').read_text()), entries


def restore(args):
    directory = Path(args.directory).resolve()
    meta, entries = validate_backup(directory)
    cfg = config()
    validate_environment(cfg)
    data = mount_source(cfg, 'db', '/var/lib/mysql')
    uploads = mount_source(cfg, 'backend', '/app/public/uploads')
    # Never overwrite an initialized target. Existing deployments require a separate clean recovery directory.
    if data.exists() and any(data.iterdir()):
        raise RuntimeError('Refusing to overwrite a non-empty database directory')
    if uploads.exists() and any(uploads.rglob('*')):
        raise RuntimeError('Refusing to overwrite a non-empty uploads directory')
    if compose('ps', '-a', '-q', capture_output=True, text=True).stdout.strip():
        raise RuntimeError('Target Compose project already has containers; choose a new project name')
    if not args.confirm_empty_target:
        raise RuntimeError('Pass --confirm-empty-target after checking project name, ports and data paths')
    if 'images.tar.gz' not in entries:
        raise RuntimeError('Offline restore requires an images.tar.gz backup')
    arch = run(['docker', 'info', '--format', '{{.Architecture}}'], capture_output=True, text=True).stdout.strip()
    if arch != meta['architecture']:
        raise RuntimeError('Saved images have a different architecture')
    print('Loading saved images...')
    with gzip.open(directory / 'images.tar.gz', 'rb') as source:
        proc = subprocess.Popen(['docker', 'image', 'load'], stdin=subprocess.PIPE)
        try:
            shutil.copyfileobj(source, proc.stdin)
        finally:
            proc.stdin.close()
        if proc.wait():
            raise RuntimeError('Image load failed')
    restored = {}
    for service, image in meta['images'].items():
        actual = run(['docker', 'image', 'inspect', image['tag'], '--format', '{{.Id}}'], capture_output=True, text=True).stdout.strip()
        if actual != image['id']:
            raise RuntimeError('Image identity mismatch: ' + service)
        restored[service] = {'image': image['tag']}
    if set(restored) != set(cfg['services']):
        raise RuntimeError('Backup must contain all service images')
    OVERRIDE.write_text(json.dumps({'services': restored}, indent=2) + '\n')
    OVERRIDE.chmod(0o600)
    prepare(cfg)
    with tarfile.open(directory / 'uploads.tar.gz', 'r:gz') as tar:
        for member in tar.getmembers():
            parts = Path(member.name).parts
            if not parts or parts[0] != 'uploads' or '..' in parts or member.issym() or member.islnk() or not (member.isfile() or member.isdir()):
                raise RuntimeError('Unsafe uploads archive entry')
            dest = uploads.joinpath(*parts[1:])
            if member.isdir():
                dest.mkdir(parents=True, exist_ok=True)
            else:
                dest.parent.mkdir(parents=True, exist_ok=True)
                with tar.extractfile(member) as source, dest.open('wb') as out:
                    shutil.copyfileobj(source, out)
                dest.chmod(0o644)
            if os.geteuid() == 0:
                os.chown(dest, 1000, 1000)
    compose('up', '-d', '--no-build', '--pull', 'never', '--wait', '--wait-timeout', '600', 'db')
    try:
        with gzip.open(directory / 'database.sql.gz', 'rb') as source:
            sql(infile=source)
        # Use recovered schema as-is. Future source upgrades apply migrations via deploy.
        compose('up', '-d', '--no-build', '--pull', 'never', '--wait', '--wait-timeout', '600')
        verify()
    except Exception:
        compose('stop')
        raise
    print('Restore completed. Exact saved images are selected by .restore-images.json.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='action', required=True)
    p = sub.add_parser('deploy')
    p.add_argument('--build', action='store_true', help='build selected services, sequentially')
    p.add_argument('--from-source', action='store_true', help='leave exact recovery images and use source configuration')
    p.add_argument('services', nargs='*', metavar='SERVICE')
    p = sub.add_parser('backup')
    p.add_argument('directory')
    p.add_argument('--no-images', action='store_true', help='data/source only; not sufficient for offline restore')
    p = sub.add_parser('restore')
    p.add_argument('directory')
    p.add_argument('--confirm-empty-target', action='store_true')
    sub.add_parser('migrate')
    sub.add_parser('verify')
    args = parser.parse_args()
    if args.action == 'deploy' and any(s not in ['backend', 'frontend', 'db', 'phpmyadmin'] for s in args.services):
        parser.error('Valid services: backend frontend db phpmyadmin')
    os.umask(0o077)
    # Serialize deployment, migration, backup and restore for this repository.
    with (ROOT / '.ops.lock').open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        if args.action == 'deploy': deploy(args)
        elif args.action == 'backup': backup(args)
        elif args.action == 'restore': restore(args)
        elif args.action == 'migrate': migrate()
        elif args.action == 'verify': verify()


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, subprocess.CalledProcessError, OSError, ValueError, KeyError) as exc:
        # subprocess errors can include secret-bearing args; do not print the exception command.
        if isinstance(exc, subprocess.CalledProcessError):
            print('Operation failed. Check the preceding service output; no automatic data deletion was performed.', file=sys.stderr)
        else:
            print(str(exc), file=sys.stderr)
        sys.exit(1)
