import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Shelter } from '../types/shelter.model';

@Injectable({
  providedIn: 'root'
})
export class SheltersService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getShelters(): Observable<Shelter[]> {
    return this.http.get<{ success: boolean; data: Shelter[] }>(`${this.apiUrl}/protectoras/publicas`)
      .pipe(map(res => res.data));
  }
}