import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Animal } from "../types/animal.model"
import { ANIMALES } from '../data/animals.mock';

@Injectable({
  providedIn: 'root'
})

export class AnimalsService {

  getAnimals(): Observable<Animal[]> {
    return of(ANIMALES); // mock, despues cambiar a API real
  }
}

