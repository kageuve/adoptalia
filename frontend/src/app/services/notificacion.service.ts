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
  if (!this.authService.isLoggedIn()) return;

  const rol = this.authService.getRol();

  if (rol === 'protectora') {
    // Protectora: cuenta solicitudes pendientes de recibir
    this.http.get<any>(`${this.apiUrl}/peticiones/protectora`, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        const pendientes = res.data.filter((p: any) => p.estado === 'pendiente').length;
        this._pendientes.next(pendientes);
      },
      error: () => this._pendientes.next(0)
    });
  } else {
    // Usuario: cuenta solicitudes aprobadas o rechazadas no vistas
    this.http.get<any>(`${this.apiUrl}/peticiones/mis-peticiones`, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        const noVistas = res.data.filter((p: any) => p.estado !== 'pendiente' && !p.visto).length;
        this._pendientes.next(noVistas);
      },
      error: () => this._pendientes.next(0)
    });
  }
}

  resetPendientes(): void {
    this._pendientes.next(0);
  }

marcarVistas(): void {
  this.http.put(`${this.apiUrl}/peticiones/marcar-vistas`, {}, { headers: this.getHeaders() }).subscribe({
    next: (res) => {
      this._pendientes.next(0);
      this.cargarPendientes();
    },
    error: (err) => {
      console.error('error marcando vistas:', err);
    }
  });
}
}