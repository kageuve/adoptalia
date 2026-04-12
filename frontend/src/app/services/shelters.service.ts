import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Shelter } from '../types/shelter.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SheltersService {

  private apiUrl = environment.apiUrl; //ajusta el puerto

  constructor(private http: HttpClient) {}

  getShelters(): Observable<Shelter[]> {
    return this.http.get<{ success: boolean; data: Shelter[] }>(`${this.apiUrl}/protectoras/publicas`)
      .pipe(map(res => res.data));
  }
}