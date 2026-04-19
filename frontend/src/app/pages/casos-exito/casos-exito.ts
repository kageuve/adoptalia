import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalsService } from '../../services/animals.service';

@Component({
  selector: 'app-casos-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './casos-exito.html',
  styleUrl: './casos-exito.scss'
})
export class CasosExito implements OnInit {

  animales: any[] = [];
  cargando = true;

  constructor(private animalsService: AnimalsService) {}

  ngOnInit(): void {
    // Cargar animales con estado 'adoptado'
    this.animalsService.getAnimalesAdoptados().subscribe({
      next: (data) => {
        this.animales = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando casos de éxito:', err);
        this.cargando = false;
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
