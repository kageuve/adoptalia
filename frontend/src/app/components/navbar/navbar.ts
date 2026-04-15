import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  menuOpen = false;
  userMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

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
    this.authService.logout();
    this.closeUserMenu();
    this.closeMenu();
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeUserMenu();
  }
}
