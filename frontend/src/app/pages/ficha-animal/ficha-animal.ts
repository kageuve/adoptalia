import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimalsService } from '../../services/animals.service';
import { Animal } from '../../types/animal.model';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.animalsService.getAnimalById(+id).subscribe({
        next: (data) => {
          this.animal = data;
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
        }
      });
    }
  }
}