import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})

export class FilterBar {
  filtros = {
    especie: '',
    provincia: '',
    tamano: '',
    edad: ''
  };


  aplicarFiltros() {
    this.filtrosChange.emit(this.filtros);
  }


  onFiltrosChange() {
    this.filtros = { ...this.filtros };
  }

  @Output() filtrosChange = new EventEmitter<any>();
}
