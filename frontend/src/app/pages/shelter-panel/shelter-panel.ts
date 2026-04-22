import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PeticionService } from '../../services/peticion.service';
import { AnimalsService } from '../../services/animals.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { NotificacionService } from '../../services/notificacion.service';

interface ShelterAnimal {
  id: number;
  nombre: string;
  especie: string;
  raza?: string | null;
  estado: 'disponible' | 'reservado' | 'adoptado';
  genero: string;
  tamano: string;
  fecha_nacimiento?: string | null;
  descripcion?: string | null;
  imagen_url?: string | null;
}

interface ShelterRequest {
  id: number;
  animal: string;
  adoptante: string;
  fecha: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
}


@Component({
  selector: 'app-shelter-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shelter-panel.html',
  styleUrl: './shelter-panel.scss'
})
export class ShelterPanel implements OnInit {

  mostrarFormulario = false;
  editandoId: number | null = null;
  imagenPreview: string | null = null;
  readonly animalForm;

  animales: ShelterAnimal[] = [];
  solicitudes: ShelterRequest[] = [];
  private apiUrl: string;
  protectora: any = null;
  passwordMensaje: string | null = null;
  mostrarPasswordForm = false;
  readonly passwordForm;

  mostrarPasswordActual = false;
  mostrarPasswordNuevo = false;
  mostrarPasswordConfirm = false;

  togglePasswordActual() { this.mostrarPasswordActual = !this.mostrarPasswordActual; }
  togglePasswordNuevo() { this.mostrarPasswordNuevo = !this.mostrarPasswordNuevo; }
  togglePasswordConfirm() { this.mostrarPasswordConfirm = !this.mostrarPasswordConfirm; }

  constructor(
    private fb: FormBuilder,
    private peticionService: PeticionService,
    private animalsService: AnimalsService,
    private http: HttpClient,
    private authService: AuthService,
    private notificacionService: NotificacionService
  ) {
    this.apiUrl = environment.apiUrl;
    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNuevo: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', Validators.required]
    });
    this.animalForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['Perro', Validators.required],
      raza: [''],
      genero: ['Hembra', Validators.required],
      tamano: ['Mediano', Validators.required],
      estado: ['disponible', Validators.required],
      fecha_nacimiento: [null as string | null],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.animalsService.getAnimalesProtectora().subscribe({
      next: (data) => {
        this.animales = data;
      },
      error: (err) => console.error('Error cargando animales:', err)
    });

    this.peticionService.getPeticionesProtectora().subscribe({
      next: (data) => {
        this.solicitudes = data.map(p => ({
          id: p.id,
          animal: p.animal,
          adoptante: p.adoptante,
          fecha: new Date(p.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
          estado: p.estado
        }));
      },
      error: (err) => console.error('Error cargando solicitudes:', err)
    });

    this.http.get<any>(`${this.apiUrl}/protectoras/mi-protectora`, { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` }) }).subscribe({
  next: (res) => {
    this.protectora = res.data;
    this.authService.setImagen(res.data?.imagen ?? null);
  },
  error: (err) => console.error('Error cargando protectora:', err)
});

  }

  get totalAnimales(): number {
    return this.animales.length;
  }

  get totalSolicitudes(): number {
    return this.solicitudes.length;
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cancelarEdicion();
    }
  }

  guardarAnimal(): void {
    if (this.animalForm.invalid) {
      this.animalForm.markAllAsTouched();
      return;
    }

    const animal = this.animalForm.getRawValue() as ShelterAnimal;

    if (this.editandoId) {
      this.animalsService.actualizarAnimal(this.editandoId, animal).subscribe({
        next: () => {
          this.animales = this.animales.map(item =>
            item.id === this.editandoId ? { ...item, ...animal } : item
          );
          this.cancelarEdicion();
        },
        error: (err) => console.error('Error actualizando animal:', err)
      });
    } else {
      this.animalsService.crearAnimal(animal).subscribe({
        next: (res) => {
          const nuevoAnimal: ShelterAnimal = { ...animal, id: res.id };
          this.animales = [nuevoAnimal, ...this.animales];
          this.editarAnimal(nuevoAnimal);
        },
        error: (err) => console.error('Error creando animal:', err)
      });
    }
  }

  editarAnimal(animal: ShelterAnimal): void {
    this.editandoId = animal.id;
    this.mostrarFormulario = true;
    this.imagenPreview = animal.imagen_url ?? null;
    this.animalForm.patchValue({
      nombre: animal.nombre,
      especie: animal.especie,
      raza: animal.raza ?? '',
      genero: animal.genero,
      tamano: animal.tamano,
      estado: animal.estado,
      fecha_nacimiento: animal.fecha_nacimiento
        ? animal.fecha_nacimiento.split('T')[0]
        : null,
      descripcion: animal.descripcion ?? ''
    });
  }

  eliminarAnimal(id: number): void {
    this.animalsService.eliminarAnimal(id).subscribe({
      next: () => {
        this.animales = this.animales.filter(animal => animal.id !== id);
      },
      error: (err) => console.error('Error eliminando animal:', err)
    });
  }

actualizarSolicitud(id: number, estado: 'aprobada' | 'rechazada'): void {
  this.peticionService.actualizarPeticion(id, estado).subscribe({
    next: () => {
      this.solicitudes = this.solicitudes.map(s =>
        s.id === id ? { ...s, estado } : s
      );
      this.notificacionService.cargarPendientes();
    },
    error: (err) => console.error('Error actualizando solicitud:', err)
  });
}

  cancelarEdicion(): void {
    this.editandoId = null;
    this.mostrarFormulario = false;
    this.imagenPreview = null;
    this.animalForm.reset({
      nombre: '',
      especie: 'Perro',
      raza: '',
      genero: 'Hembra',
      tamano: 'Mediano',
      estado: 'disponible',
      fecha_nacimiento: null,
      descripcion: ''
    });
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }

  getBadgeClass(estado: string): string {
    return `badge badge-${estado}`;
  }

  importarCSV(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const formData = new FormData();
    formData.append('archivo', input.files[0]);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    this.http.post<any>(`${this.apiUrl}/import/subir-csv`, formData, { headers }).subscribe({
      next: (res) => {
        alert(`Importación completada: ${res.insertados} animales añadidos`);
        this.animalsService.getAnimalesProtectora().subscribe(data => this.animales = data);
      },
      error: (err) => console.error('Error importando CSV:', err)
    });
  }

  subirImagenProtectora(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const formData = new FormData();
    formData.append('imagen', input.files[0]);
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
    this.http.post<any>(`${this.apiUrl}/protectoras/mi-protectora/imagen`, formData, { headers }).subscribe({
      next: (res) => {
        if (this.protectora) this.protectora = { ...this.protectora, imagen: res.imagen };
        this.authService.setImagen(res.imagen);
      },
      error: (err) => console.error('Error subiendo imagen de protectora:', err)
    });
  }

  cambiarPassword(): void {
    const { passwordActual, passwordNuevo, passwordConfirm } = this.passwordForm.getRawValue();
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    if (passwordNuevo !== passwordConfirm) {
      this.passwordMensaje = 'Las contraseñas nuevas no coinciden';
      return;
    }
    this.authService.cambiarPassword(passwordActual!, passwordNuevo!).subscribe({
      next: () => {
        this.passwordMensaje = 'ok';
        this.passwordForm.reset();
      },
      error: (err) => { this.passwordMensaje = err.error?.message ?? 'Error al cambiar contraseña'; }
    });
  }

  togglePasswordForm(): void {
    this.mostrarPasswordForm = !this.mostrarPasswordForm;
    if (!this.mostrarPasswordForm) {
      this.passwordMensaje = null;
      this.passwordForm.reset();
    }
  }

  subirImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.editandoId) return;

    const formData = new FormData();
    formData.append('imagen', input.files[0]);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    this.http.post<any>(`${this.apiUrl}/animales/${this.editandoId}/imagen`, formData, { headers }).subscribe({
      next: (res) => {
        this.imagenPreview = res.imagen_url;
        this.animales = this.animales.map(a =>
          a.id === this.editandoId ? { ...a, imagen_url: res.imagen_url } : a
        );
      },
      error: (err) => console.error('Error subiendo imagen:', err)
    });
  }
}
