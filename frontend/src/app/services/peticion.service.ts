import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class PeticionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  crearPeticion(animal_id: number, mensaje?: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/peticiones`, { animal_id, mensaje }, { headers });
  }

  comprobarPeticion(animal_id: number): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.get(`${this.apiUrl}/peticiones/comprobar/${animal_id}`, { headers });
}

getMisPeticiones(): Observable<any[]> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/peticiones/mis-peticiones`, { headers })
    .pipe(map(res => res.data));
}

getPeticionesProtectora(): Observable<any[]> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/peticiones/protectora`, { headers })
    .pipe(map(res => res.data));
}

actualizarPeticion(id: number, estado: 'aprobada' | 'rechazada'): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.put(`${this.apiUrl}/peticiones/${id}`, { estado }, { headers });
}

}