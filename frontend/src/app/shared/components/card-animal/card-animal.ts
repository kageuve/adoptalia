import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-animal',
  standalone: true,
  imports: [],
  templateUrl: './card-animal.html',
  styleUrl: './card-animal.scss',
})

export class CardAnimal {
  @Input() nombre!: string;
  @Input() edad!: number;
  @Input() descripcion!: string;
  @Input() imagen!: string;

  @Input() botonTexto: string = 'Adoptar';
  @Output() botonClick = new EventEmitter<void>();

  onClick() {
    this.botonClick.emit();
  }
}
