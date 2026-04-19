import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Animal } from '../types/animal.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
//import { ANIMALES } from '../data/animals.mock'; //-->Mock de datos

@Injectable({ providedIn: 'root' })
export class AnimalsService {

  private apiUrl = environment.apiUrl; // ajusta el puerto

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAnimals(): Observable<Animal[]> {
    return this.http.get<{ success: boolean; data: Animal[] }>(`${this.apiUrl}/animales/publicos`)
      .pipe(map(res => res.data));
  }

  getAnimalesAdoptados(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/animales/adoptados`)
      .pipe(map(res => res.data));
  }

  getAnimalById(id: number): Observable<Animal> {
  return this.http.get<{ success: boolean; data: Animal }>(`${this.apiUrl}/animales/publico/${id}`)
    .pipe(map(res => res.data));
}

getAnimalesProtectora(): Observable<any[]> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/animales/mi-protectora`, { headers })
    .pipe(map(res => res.data));
}

crearAnimal(datos: any): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.post(`${this.apiUrl}/animales`, datos, { headers });
}

actualizarAnimal(id: number, datos: any): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.put(`${this.apiUrl}/animales/${id}`, datos, { headers });
}

eliminarAnimal(id: number): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.delete(`${this.apiUrl}/animales/${id}`, { headers });
}

}

