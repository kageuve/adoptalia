import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { AvatarOnlineComponent } from '../avatars/avatar-online/avatar-online';
import { AvatarNotifComponent } from '../avatars/avatar-notif/avatar-notif';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, AvatarOnlineComponent, AvatarNotifComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {

  menuOpen = false;
  userMenuOpen = false;
  pendientes = 0;
  imagenPerfil: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.notificacionService.pendientes$.subscribe(n => this.pendientes = n);
    this.notificacionService.cargarPendientes();
    this.authService.imagenPerfil$.subscribe(img => this.imagenPerfil = img);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu(event?: Event) {
    event?.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  goToPanel() {
    const rol = this.authService.getRol();
    const route = rol === 'protectora' ? '/panel-protectora' : '/panel-adoptante';
    this.router.navigate([route]);
    this.closeUserMenu();
    this.closeMenu();
  }

  logout() {
    this.notificacionService.resetPendientes();
    this.authService.logout();
    this.closeUserMenu();
    this.closeMenu();
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeUserMenu();
  }
}