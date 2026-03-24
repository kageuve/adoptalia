import { Component, inject } from '@angular/core';
import { AnimalsService } from "../../services/animals.service";
import { Animal } from '../../types/animal.model';
import { Hero } from "../../components/hero/hero";
import { FilterBar } from "../../components/filter-bar/filter-bar";
import { Categories } from "../../components/categories/categories";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ Hero, FilterBar, Categories],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})

export class Home {
  private animalsService = inject(AnimalsService);

  animales: Animal[] = [];

  constructor() {
    this.cargarAnimales();
  }

  cargarAnimales() {
    this.animalsService.getAnimals().subscribe(data => {
      this.animales = data;
    });
  }

  // Asegura que la página se desplace al inicio cada vez que se carga
  ngAfterViewInit() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }  
}
