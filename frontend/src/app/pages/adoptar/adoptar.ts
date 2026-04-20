import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterBar } from "../../components/filter-bar/filter-bar";
import { Animal } from "../../types/animal.model";
import { AnimalsService } from "../../services/animals.service";
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-adoptar',
  standalone: true,
  imports: [FilterBar, CommonModule, RouterLink],
  templateUrl: './adoptar.html',
  styleUrls: ['./adoptar.scss']
})
export class Adoptar implements OnInit {

  animales: Animal[] = [];
  animalesFiltrados: Animal[] = [];
  favoritosIds: number[] = [];

  filtros = {
    especie: '',
    provincia: '',
    tamano: '',
    edad: ''
  };

  constructor(
    private animalsService: AnimalsService,
    private route: ActivatedRoute,
    private favoritoService: FavoritoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarAnimales();
    if (this.esUsuario()) {
      this.favoritoService.getFavoritos().subscribe({
        next: (data) => { this.favoritosIds = data.map(f => f.id); },
        error: () => {}
      });
    }
  }

  esUsuario(): boolean {
    return this.authService.isLoggedIn() && this.authService.getRol() === 'usuario';
  }

  esFavorito(id: number): boolean {
    return this.favoritosIds.includes(id);
  }

  toggleFavorito(id: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.esFavorito(id)) {
      this.favoritoService.eliminarFavorito(id).subscribe({
        next: () => { this.favoritosIds = this.favoritosIds.filter(fid => fid !== id); },
        error: (err) => console.error(err)
      });
    } else {
      this.favoritoService.agregarFavorito(id).subscribe({
        next: () => { this.favoritosIds = [...this.favoritosIds, id]; },
        error: (err) => console.error(err)
      });
    }
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

  hayFiltrosActivos(): boolean {
    return Object.values(this.filtros).some(valor => !!valor);
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
