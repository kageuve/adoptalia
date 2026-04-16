
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface ShelterAnimal {
  id: number;
  nombre: string;
  especie: string;
  estado: 'disponible' | 'reservado' | 'adoptado';
  genero: string;
  tamano: string;
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
export class ShelterPanel {
  mostrarFormulario = false;
  editandoId: number | null = null;
  readonly animalForm;

  animales: ShelterAnimal[] = [
    { id: 1, nombre: 'Luna', especie: 'Perro', estado: 'disponible', genero: 'Hembra', tamano: 'Grande' },
    { id: 2, nombre: 'Nala', especie: 'Gato', estado: 'reservado', genero: 'Hembra', tamano: 'Pequeño' },
    { id: 3, nombre: 'Rocky', especie: 'Perro', estado: 'adoptado', genero: 'Macho', tamano: 'Mediano' }
  ];

  solicitudes: ShelterRequest[] = [
    { id: 1, animal: 'Luna', adoptante: 'lucia@email.com', fecha: '11 abr 2026', estado: 'pendiente' },
    { id: 2, animal: 'Nala', adoptante: 'jose@email.com', fecha: '09 abr 2026', estado: 'aprobada' },
    { id: 3, animal: 'Rocky', adoptante: 'ana@email.com', fecha: '05 abr 2026', estado: 'rechazada' }
  ];

  constructor(private fb: FormBuilder) {
    this.animalForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['Perro', Validators.required],
      genero: ['Hembra', Validators.required],
      tamano: ['Mediano', Validators.required],
      estado: ['disponible', Validators.required]
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

    const animal = this.animalForm.getRawValue() as Omit<ShelterAnimal, 'id'>;

    if (this.editandoId) {
      this.animales = this.animales.map((item) =>
        item.id === this.editandoId ? { ...item, ...animal } : item
      );
    } else {
      this.animales = [
        { id: Date.now(), ...animal },
        ...this.animales
      ];
    }

    this.cancelarEdicion();
  }

  editarAnimal(animal: ShelterAnimal): void {
    this.editandoId = animal.id;
    this.mostrarFormulario = true;
    this.animalForm.patchValue(animal);
  }

  eliminarAnimal(id: number): void {
    this.animales = this.animales.filter((animal) => animal.id !== id);
  }

  actualizarSolicitud(id: number, estado: 'aprobada' | 'rechazada'): void {
    this.solicitudes = this.solicitudes.map((solicitud) =>
      solicitud.id === id ? { ...solicitud, estado } : solicitud
    );
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.mostrarFormulario = false;
    this.animalForm.reset({
      nombre: '',
      especie: 'Perro',
      genero: 'Hembra',
      tamano: 'Mediano',
      estado: 'disponible'
    });
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }

  getBadgeClass(estado: string): string {
    return `badge badge-${estado}`;
  }
}
