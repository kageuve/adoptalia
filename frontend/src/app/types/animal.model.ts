export interface Animal {
  id: number;
  nombre: string;
  especie: 'Perro' | 'Gato';
  raza: string;
  edad: number | null;
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  provincia: string;
  imagen: string | null;
  genero?: 'macho' | 'hembra';
  descripcion?: string | null;
  estado?: 'disponible' | 'reservado' | 'adoptado';
  protectora?: string;
}