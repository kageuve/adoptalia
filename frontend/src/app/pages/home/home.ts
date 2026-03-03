import { Component, inject } from '@angular/core';
import { CardAnimal } from '../../shared/components/card-animal/card-animal';
import { AnimalesService, Animal } from '../../core/services/animales.service';
import { NgFor } from '@angular/common';
import { Hero } from "../../components/hero/hero";
import { FilterBar } from "../../components/filter-bar/filter-bar";
import { Categories } from "../../components/categories/categories";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardAnimal, NgFor, Hero, FilterBar, Categories],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  // Inyectamos el servicio usando inject()
  private animalesService = inject(AnimalesService);

  animales: Animal[] = [];

  constructor() {
    // Obtenemos los animales al iniciar el componente
    this.animales = this.animalesService.getAnimales();
  }
}
