import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private imagenSubject = new BehaviorSubject<string | null>(localStorage.getItem('imagenPerfil'));
  imagenPerfil$ = this.imagenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

setImagen(imagen: string | null): void {
  if (imagen) {
    const baseUrl = this.apiUrl.replace('/api', '');
    const imagenCompleta = imagen.startsWith('http') ? imagen : `${baseUrl}${imagen}`;
    localStorage.setItem('imagenPerfil', imagenCompleta);
    this.imagenSubject.next(imagenCompleta);
  } else {
    localStorage.removeItem('imagenPerfil');
    this.imagenSubject.next(null);
  }
}

  getImagen(): string | null {
    return localStorage.getItem('imagenPerfil');
  }

  cambiarPassword(passwordActual: string, passwordNuevo: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
    return this.http.put(`${this.apiUrl}/auth/cambiar-password`, { passwordActual, passwordNuevo }, { headers });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
    tap(res => {
    localStorage.setItem('token', res.token);
    localStorage.setItem('rol', res.rol);
    localStorage.setItem('email', res.email);
      if (res.imagen) {
        this.setImagen(res.imagen);
      }
    })
    );
  }

  registerUsuario(email: string, password: string, nombre?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { email, password, rol: 'usuario', nombre });
  }

  registerProtectora(datos: { email: string; password: string; nombre: string; cif: string; ciudad: string; telefono?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/protectoras/registrar-protectora`, datos);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    localStorage.removeItem('imagenPerfil');
    this.imagenSubject.next(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }
}