import { Injectable } from '@angular/core';

export interface Animal {
  nombre: string;
  edad: number;
  descripcion: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnimalesService {

  //simulacion de datos. Cambiar por BD
  private animales: Animal[] = [
    { nombre: 'Firulais', edad: 3, descripcion: 'Perro juguetón y amistoso', imagen: 'https://purina.cl/sites/default/files/2023-10/perro-mestizo-sentado.webp' },
    { nombre: 'Michi', edad: 2, descripcion: 'Gato travieso', imagen: 'https://estaticos-cdn.prensaiberica.es/clip/646c8b0a-23c8-4fa1-99c1-ca51a89d3968_alta-libre-aspect-ratio_default_0.jpg' },
    { nombre: 'Pipo', edad: 8, descripcion: 'Perro leal y cariñoso', imagen: 'https://cdn.shopify.com/s/files/1/0268/6861/files/puppy-dog-red-mammal-curiosity-vertebrate-730900-pxhere.com_480x480.jpg' }
  ];

  getAnimales(): Animal[] {
    return this.animales;
  } 
}
