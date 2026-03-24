import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SHELTERS } from '../data/shelters.mock';
import { Shelter } from '../types/shelter.model';

@Injectable({
  providedIn: 'root'
})
export class SheltersService {

  getShelters(): Observable<Shelter[]> {
    return of(SHELTERS);
  }
}