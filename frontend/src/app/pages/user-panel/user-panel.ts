import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PeticionService } from '../../services/peticion.service';

interface AdoptionRequest {
  id: number;
  animal: string;
  imagen: string | null;
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
export class UserPanel implements OnInit {

  readonly usuarioEmail: string;

  solicitudes: AdoptionRequest[] = [];

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

  constructor(private authService: AuthService, private peticionService: PeticionService) {
    this.usuarioEmail = this.authService.getEmail() ?? 'adoptante@adoptalia.com';
  }

  ngOnInit(): void {
    this.peticionService.getMisPeticiones().subscribe({
      next: (data) => {
        this.solicitudes = data.map(p => ({
          id: p.id,
          animal: p.animal,
          imagen: p.imagen || null,
          protectora: p.protectora,
          fecha: new Date(p.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
          estado: p.estado,
          mensaje: p.mensaje || ''
        }));
      },
      error: (err) => console.error('Error cargando peticiones:', err)
    });
  }

  get solicitudesPendientes(): number {
    return this.solicitudes.filter(s => s.estado === 'pendiente').length;
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }

  getBadgeClass(estado: AdoptionRequest['estado']): string {
    return `badge badge-${estado}`;
  }

  cancelarSolicitud(id: number): void {
  this.peticionService.cancelarPeticion(id).subscribe({
    next: () => {
      this.solicitudes = this.solicitudes.filter(s => s.id !== id);
    },
    error: (err) => console.error('Error cancelando solicitud:', err)
  });
}

}