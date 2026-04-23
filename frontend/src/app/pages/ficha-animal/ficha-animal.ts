import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimalsService } from '../../services/animals.service';
import { Animal } from '../../types/animal.model';
import { AuthService } from '../../services/auth.service';
import { PeticionService } from '../../services/peticion.service';
import { FavoritoService } from '../../services/favorito.service';

@Component({
  selector: 'app-ficha-animal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ficha-animal.html',
  styleUrl: './ficha-animal.scss',
})
export class FichaAnimal implements OnInit {

  animal: Animal | null = null;
  cargando = true;
  solicitudEnviada = false;
  errorSolicitud = false;
  esFavorito = false;

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService,
    public authService: AuthService,
    private peticionService: PeticionService,
    private favoritoService: FavoritoService
  ) {}

  esProtectora(): boolean {
    return this.authService.getRol() === 'protectora';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.animalsService.getAnimalById(+id).subscribe({
        next: (data) => {
          this.animal = data;
          this.cargando = false;
          if (this.authService.isLoggedIn()) {
            this.peticionService.comprobarPeticion(data.id).subscribe({
              next: (res) => {
                if (res.existe) this.solicitudEnviada = true;
              }
            });
            this.favoritoService.comprobarFavorito(data.id).subscribe({
              next: (esFavorito) => {
                this.esFavorito = esFavorito;
              }
            });
          }
        },
        error: () => {
          this.cargando = false;
        }
      });
    }
  }

  solicitarAdopcion(): void {
    if (!confirm('¿Confirmas la solicitud de adopción?')) return;
    if (!this.animal) return;
    this.peticionService.crearPeticion(this.animal.id).subscribe({
      next: () => {
        this.solicitudEnviada = true;
        this.errorSolicitud = false;
      },
      error: () => {
        this.errorSolicitud = true;
      }
    });
  }

  toggleFavorito(): void {
    if (!this.animal) return;
    if (this.esFavorito) {
      this.favoritoService.eliminarFavorito(this.animal.id).subscribe({
        next: () => this.esFavorito = false,
        error: (err) => console.error('Error eliminando favorito:', err)
      });
    } else {
      this.favoritoService.agregarFavorito(this.animal.id).subscribe({
        next: () => this.esFavorito = true,
        error: (err) => console.error('Error añadiendo favorito:', err)
      });
    }
  }
}
