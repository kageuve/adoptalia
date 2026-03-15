import { Component } from '@angular/core';

@Component({
  selector: 'app-como-funciona',
  imports: [],
  templateUrl: './como-funciona.html',
  styleUrl: './como-funciona.scss',
})
export class ComoFunciona {

  // Asegura que la página se desplace al inicio cada vez que se carga
  ngAfterViewInit() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
