#!/usr/bin/env python3
"""Destructive fixture creation: run ONLY against an isolated test stack."""
import argparse, json, urllib.request, urllib.error, uuid, base64
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--url', default='http://127.0.0.1:18080')
p.add_argument('--allow-test-data', action='store_true')
a=p.parse_args()
if not a.allow_test_data: p.error('Explicit --allow-test-data required')
base=a.url.rstrip('/')
suffix=uuid.uuid4().hex[:10]
password='Integration-test-12345'

def request(method, path, data=None, token=None, status=200, raw=None, content_type=None):
    headers={}
    if token: headers['Authorization']='Bearer '+token
    if raw is not None: body=raw;headers['Content-Type']=content_type
    elif data is not None: body=json.dumps(data).encode();headers['Content-Type']='application/json'
    else: body=None
    req=urllib.request.Request(base+path,body,headers,method=method)
    try:
        with urllib.request.urlopen(req,timeout=15) as r: code=r.status;out=r.read()
    except urllib.error.HTTPError as e: code=e.code;out=e.read()
    assert code==status,(method,path,'expected',status,'got',code,out[:150])
    try: return json.loads(out)
    except ValueError: return out

request('GET','/api/health/ready')
request('GET','/api/animales/publicos')
request('POST','/api/auth/register',{'email':f'bad-{suffix}@example.invalid','password':password,'rol':'administrador'},status=400)
request('POST','/api/auth/login',{'email':{},'password':password},status=400)
tokens=[]
for i in range(2):
    email=f'shelter-{suffix}-{i}@example.invalid'
    request('POST','/api/protectoras/registrar-protectora',{'email':email,'password':password,'nombre':'Test shelter','cif':suffix+str(i),'ciudad':'Test'},status=201)
    tokens.append(request('POST','/api/auth/login',{'email':email,'password':password})['token'])
email=f'user-{suffix}@example.invalid'
request('POST','/api/auth/register',{'email':email,'password':password,'rol':'usuario','nombre':'Test'},status=201)
user=request('POST','/api/auth/login',{'email':email,'password':password})['token']
animal={'nombre':'Test animal','especie':'perro','genero':'macho','tamano':'mediano','estado':'disponible'}
id=request('POST','/api/animales',animal,tokens[0],201)['id']
request('PUT',f'/api/animales/{id}',animal,tokens[1],403)
request('DELETE',f'/api/animales/{id}',token=tokens[1],status=403)
request('PUT',f'/api/animales/{id}',animal,user,403)
request('PUT',f'/api/animales/{id}',animal,tokens[0])
pid=request('POST','/api/peticiones',{'animal_id':id,'mensaje':'test'},user,201)['id']
request('PUT',f'/api/peticiones/{pid}',{'estado':'aprobada'},tokens[1],403)
request('PUT',f'/api/peticiones/{pid}',{'estado':'aprobada'},user,403)
request('DELETE',f'/api/peticiones/{pid}',token=tokens[1],status=403)
request('PUT',f'/api/peticiones/{pid}',{'estado':'aprobada'},tokens[0])
assert request('GET',f'/api/animales/publico/{id}')['data']['estado']=='adoptado'
request('POST','/api/favoritos',{'animal_id':id},user,201)
assert request('GET',f'/api/favoritos/comprobar/{id}',token=user)['esFavorito'] is True
boundary='----adoptalia-test-boundary'
def multipart(content,name):
    return (f'--{boundary}\r\nContent-Disposition: form-data; name="imagen"; filename="{name}"\r\nContent-Type: image/png\r\n\r\n'.encode()+content+f'\r\n--{boundary}--\r\n'.encode())
request('POST',f'/api/animales/{id}/imagen',token=tokens[0],status=400,raw=multipart(b'<svg>bad</svg>','image.png'),content_type='multipart/form-data; boundary='+boundary)
png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5V0AAAAASUVORK5CYII=')
image=request('POST',f'/api/animales/{id}/imagen',token=tokens[0],raw=multipart(png,'image.png'),content_type='multipart/form-data; boundary='+boundary)['imagen_url']
assert request('GET',image)==png
request('DELETE',f'/api/peticiones/{pid}',token=user)
print(json.dumps({'result':'PASS','animal_id':id,'uploaded_image':image,'suffix':suffix}))
