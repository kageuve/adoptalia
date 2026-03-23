import { Component, OnInit } from '@angular/core';
import { FilterBar } from "../../components/filter-bar/filter-bar";
import { Animal } from "../../types/animal.model";
import { AnimalsService } from "../../services/animals.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adoptar',
  standalone: true,
  imports: [FilterBar,CommonModule],
  templateUrl: './adoptar.html',
  styleUrls: ['./adoptar.scss']
})

export class Adoptar implements OnInit {

  animales: Animal[] = [];
  animalesFiltrados: Animal[] = [];

  // filtros activos
  filtros = {
    especie: '',
    provincia: '',
    tamaño: '',
    edad: ''
  };

  constructor(private animalsService: AnimalsService) {}

ngOnInit(): void {
  this.cargarAnimales();
}

    // Cargar datos desde el servicio (mock por ahora)
  cargarAnimales(): void {
    this.animalsService.getAnimals().subscribe(data => {
      this.animales = data;
      this.animalesFiltrados = data;
    });
  }

  // Aplicar filtros
  aplicarFiltros(): void {
    this.animalesFiltrados = this.animales.filter(animal => {
      return (
        (!this.filtros.especie || animal.especie === this.filtros.especie) &&
        (!this.filtros.provincia || animal.provincia === this.filtros.provincia) &&
        (!this.filtros.tamaño || animal.tamaño === this.filtros.tamaño) &&
        (!this.filtros.edad || this.filtrarPorEdad(animal.edad))
      );
    });
  }

    // Filtro por edad
  filtrarPorEdad(edad: number): boolean {
    switch (this.filtros.edad) {
      case 'joven':
        return edad <= 2;
      case 'adulto':
        return edad > 2 && edad <= 6;
      case 'senior':
        return edad > 6;
      default:
        return true;
    }
  }

    // Recibir filtros del filter-bar
  onFiltrosChange(filtros: any): void {
    this.filtros = filtros;
    this.aplicarFiltros();
  }

    // Reset filtros
  limpiarFiltros(): void {
    this.filtros = {
      especie: '',
      provincia: '',
      tamaño: '',
      edad: ''
    };
    this.animalesFiltrados = this.animales;
  }
}


