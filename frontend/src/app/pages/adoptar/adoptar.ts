import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterBar } from "../../components/filter-bar/filter-bar";
import { Animal } from "../../types/animal.model";
import { AnimalsService } from "../../services/animals.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adoptar',
  standalone: true,
  imports: [FilterBar, CommonModule],
  templateUrl: './adoptar.html',
  styleUrls: ['./adoptar.scss']
})
export class Adoptar implements OnInit {

  animales: Animal[] = [];
  animalesFiltrados: Animal[] = [];

  filtros = {
    especie: '',
    provincia: '',
    tamano: '',
    edad: ''
  };

  constructor(private animalsService: AnimalsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarAnimales();
  }

  cargarAnimales(): void {
    this.animalsService.getAnimals().subscribe(data => {
      this.animales = data;
      this.route.queryParams.subscribe(params => {
        this.filtros = {
          especie: params['especie'] || '',
          provincia: params['provincia'] || '',
          tamano: params['tamano'] || '',
          edad: params['edad'] || ''
        };
        this.aplicarFiltros();
      });
    });
  }

  aplicarFiltros(): void {
    this.animalesFiltrados = this.animales.filter(animal => {
      return (
        (!this.filtros.especie || animal.especie === this.filtros.especie) &&
        (!this.filtros.provincia || animal.provincia === this.filtros.provincia) &&
        (!this.filtros.tamano || animal.tamano === this.filtros.tamano) &&
        (!this.filtros.edad || this.filtrarPorEdad(animal.edad))
      );
    });
  }

  filtrarPorEdad(edad: number | null): boolean {
    if (edad === null) return false;
    switch (this.filtros.edad) {
      case 'joven':  return edad <= 2;
      case 'adulto': return edad > 2 && edad <= 8;
      case 'senior': return edad > 8;
      default:       return true;
    }
  }

  onFiltrosChange(filtros: any) {
    this.filtros = filtros;
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtros = { especie: '', provincia: '', tamano: '', edad: '' };
    this.animalesFiltrados = this.animales;
  }
}