export interface Animal {
  id: number;
  nombre: string;
  especie: 'Perro' | 'Gato';
  raza: string;
  edad: number;
  tamaño: 'Pequeño' | 'Mediano' | 'Grande';
  provincia: string;
  imagen: string;
}