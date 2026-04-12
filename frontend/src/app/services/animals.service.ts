import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Animal } from '../types/animal.model';
import { environment } from '../../environments/environment';
//import { ANIMALES } from '../data/animals.mock'; //-->Mock de datos

@Injectable({ providedIn: 'root' })
export class AnimalsService {

  private apiUrl = environment.apiUrl; // ajusta el puerto

  constructor(private http: HttpClient) {}

  getAnimals(): Observable<Animal[]> {
    return this.http.get<{ success: boolean; data: Animal[] }>(`${this.apiUrl}/animales/publicos`)
      .pipe(map(res => res.data));
  }
}

