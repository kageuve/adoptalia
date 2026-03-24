export interface Animal {
  id: number;
  nombre: string;
  especie: 'Perro' | 'Gato';
  raza: string;
  edad: number;
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  provincia: string;
  imagen: string;
}