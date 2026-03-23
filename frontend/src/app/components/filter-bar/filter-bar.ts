import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  imports: [],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBar {
  filtros = {
    especie: 'Perro',
    provincia: 'Madrid',
    tamaño: 'Grande',
    edad: 'adulto'
  };

  onFiltrosChange() {
    this.filtros = { ...this.filtros };
  }

  @Output() filtrosChange = new EventEmitter<any>();
}
