import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface AdoptionRequest {
  id: number;
  animal: string;
  protectora: string;
  fecha: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  mensaje: string;
}

interface FavoriteAnimal {
  id: number;
  nombre: string;
  especie: string;
  ubicacion: string;
  imagen: string;
}

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.scss'
})
export class UserPanel {
  readonly usuarioEmail: string;

  readonly solicitudes: AdoptionRequest[] = [
    {
      id: 1,
      animal: 'Luna',
      protectora: 'Huellas Felices',
      fecha: '10 abr 2026',
      estado: 'pendiente',
      mensaje: 'Hemos recibido tu solicitud y la protectora la está revisando.'
    },
    {
      id: 2,
      animal: 'Simba',
      protectora: 'Animal Love',
      fecha: '07 abr 2026',
      estado: 'aprobada',
      mensaje: 'Tu entrevista ha sido validada. La protectora se pondrá en contacto contigo.'
    },
    {
      id: 3,
      animal: 'Thor',
      protectora: 'Protección Animal Norte',
      fecha: '01 abr 2026',
      estado: 'rechazada',
      mensaje: 'La protectora ha decidido continuar con otro perfil para esta adopción.'
    }
  ];

  readonly favoritos: FavoriteAnimal[] = [
    {
      id: 1,
      nombre: 'Mía',
      especie: 'Gata persa',
      ubicacion: 'Madrid',
      imagen: 'https://service.mascotas.com/revista/Revista_63c05db2cd9d2_12012023.jpg?raw=1'
    },
    {
      id: 2,
      nombre: 'Kira',
      especie: 'Border Collie',
      ubicacion: 'Madrid',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Argentine_border_collie.jpg'
    }
  ];

  constructor(private authService: AuthService) {
    this.usuarioEmail = this.authService.getEmail() ?? 'adoptante@adoptalia.com';
  }

  get solicitudesPendientes(): number {
    return this.solicitudes.filter((solicitud) => solicitud.estado === 'pendiente').length;
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }

  getBadgeClass(estado: AdoptionRequest['estado']): string {
    return `badge badge-${estado}`;
  }
}
