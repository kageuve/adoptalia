import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private apiUrl = environment.apiUrl;
  private _pendientes = new BehaviorSubject<number>(0);
  pendientes$ = this._pendientes.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  cargarPendientes(): void {
      console.log('isLoggedIn:', this.authService.isLoggedIn());
  console.log('rol:', this.authService.getRol());
    if (!this.authService.isLoggedIn()) return;

    const rol = this.authService.getRol();

    if (rol === 'protectora') {
      this.http.get<any>(`${this.apiUrl}/peticiones/protectora`, { headers: this.getHeaders() }).subscribe({
        next: (res) => {
          const pendientes = res.data.filter((p: any) => p.estado === 'pendiente').length;
          this._pendientes.next(pendientes);
        },
        error: () => this._pendientes.next(0)
      });
    } else {
      this.http.get<any>(`${this.apiUrl}/peticiones/mis-peticiones`, { headers: this.getHeaders() }).subscribe({
        next: (res) => {
          const pendientes = res.data.filter((p: any) => p.estado === 'pendiente').length;
          this._pendientes.next(pendientes);
        },
        error: () => this._pendientes.next(0)
      });
    }
  }

  resetPendientes(): void {
    this._pendientes.next(0);
  }
}