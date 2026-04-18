import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PeticionService } from '../../services/peticion.service';
import { FavoritoService } from '../../services/favorito.service';

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
  favoritos: FavoriteAnimal[] = [];

  constructor(
    private authService: AuthService,
    private peticionService: PeticionService,
    private favoritoService: FavoritoService
  ) {
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

    this.favoritoService.getFavoritos().subscribe({
      next: (data) => {
        this.favoritos = data.map(f => ({
          id: f.id,
          nombre: f.nombre,
          especie: f.especie,
          ubicacion: f.provincia,
          imagen: f.imagen || '/img/no.image.png'
        }));
      },
      error: (err) => console.error('Error cargando favoritos:', err)
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

  eliminarFavorito(animal_id: number): void {
    this.favoritoService.eliminarFavorito(animal_id).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(f => f.id !== animal_id);
      },
      error: (err) => console.error('Error eliminando favorito:', err)
    });
  }
}