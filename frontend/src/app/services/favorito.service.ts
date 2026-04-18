import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  getFavoritos(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/favoritos`, { headers: this.getHeaders() })
      .pipe(map(res => res.data));
  }

  agregarFavorito(animal_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favoritos`, { animal_id }, { headers: this.getHeaders() });
  }

  eliminarFavorito(animal_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favoritos/${animal_id}`, { headers: this.getHeaders() });
  }

  comprobarFavorito(animal_id: number): Observable<boolean> {
    return this.http.get<{ success: boolean; esFavorito: boolean }>(`${this.apiUrl}/favoritos/comprobar/${animal_id}`, { headers: this.getHeaders() })
      .pipe(map(res => res.esFavorito));
  }
}