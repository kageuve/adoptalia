import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnimalsService } from '../../services/animals.service';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBar implements OnInit {

  filtros = {
    especie: '',
    provincia: '',
    tamano: '',
    edad: ''
  };

  provincias: string[] = [];

  constructor(private animalsService: AnimalsService, private router: Router) {}

  ngOnInit(): void {
    this.animalsService.getAnimals().subscribe(animales => {
      this.provincias = [...new Set(animales.map(a => a.provincia))].sort();
    });
  }

  aplicarFiltros() {
    this.router.navigate(['/adoptar'], { queryParams: this.filtros });
  }

  onFiltrosChange() {
    this.filtros = { ...this.filtros };
  }

  @Output() filtrosChange = new EventEmitter<any>();
}