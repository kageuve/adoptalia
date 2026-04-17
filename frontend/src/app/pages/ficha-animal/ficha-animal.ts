import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimalsService } from '../../services/animals.service';
import { Animal } from '../../types/animal.model';
import { AuthService } from '../../services/auth.service';
import { PeticionService } from '../../services/peticion.service';

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

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService,
    public authService: AuthService,
    private peticionService: PeticionService
  ) {}

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
        }
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}

  solicitarAdopcion(): void {
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
}