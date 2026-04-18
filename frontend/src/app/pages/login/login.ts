import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  isLogin = true;
  userType: 'adoptante' | 'protectora' = 'adoptante';
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  errorMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    // LOGIN FORM
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // REGISTER FORM
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cif: [''],
      ciudad: [''],
      telefono: ['']
    });

    // Leer query params (login/register)
    this.route.queryParams.subscribe(params => {
      this.isLogin = params['mode'] !== 'register';
      if (params['tipo'] === 'protectora') {
        this.setUserType('protectora');
      }
    });
  }

  // Cambiar tipo de usuario (adoptante/protectora)
  setUserType(type: 'adoptante' | 'protectora') {
    this.userType = type;
    this.errorMsg = '';
    this.successMsg = '';

    if (type === 'protectora') {
      this.registerForm.get('cif')?.setValidators(Validators.required);
      this.registerForm.get('ciudad')?.setValidators(Validators.required);
    } else {
      this.registerForm.get('cif')?.clearValidators();
      this.registerForm.get('ciudad')?.clearValidators();
    }
    this.registerForm.get('cif')?.updateValueAndValidity();
    this.registerForm.get('ciudad')?.updateValueAndValidity();
  }

  // Cambiar entre login y registro
  setMode(isLogin: boolean) {
    this.isLogin = isLogin;
    this.errorMsg = '';
    this.successMsg = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode: isLogin ? 'login' : 'register' },
      queryParamsHandling: 'merge'
    });
  }

  // LOGIN
  onLogin() {
    if (this.loginForm.invalid) return;
    this.errorMsg = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        if (res.rol === 'protectora') {
          this.router.navigate(['/panel-protectora']);
        } else {
          this.router.navigate(['/adoptar']);
        }
      },
      error: () => {
        this.errorMsg = 'Credenciales incorrectas. Revisa tu email y contraseña.';
      }
    });
  }

  // REGISTER
  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMsg = 'Por favor, completa todos los campos obligatorios.';
      return;
    }
    this.errorMsg = '';
    this.successMsg = '';
    const v = this.registerForm.value;

    if (this.userType === 'protectora') {
      this.authService.registerProtectora({
        email: v.email,
        password: v.password,
        nombre: v.nombre,
        cif: v.cif,
        ciudad: v.ciudad,
        telefono: v.telefono
      }).subscribe({
        next: () => {
          this.successMsg = 'Protectora registrada. Ya puedes iniciar sesión.';
          setTimeout(() => this.setMode(true), 2500);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Error al registrar. Inténtalo de nuevo.';
        }
      });
    } else {
      this.authService.registerUsuario(v.email, v.password).subscribe({
        next: () => {
          this.successMsg = 'Cuenta creada. Ya puedes iniciar sesión.';
          setTimeout(() => this.setMode(true), 2500);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Error al registrar. Inténtalo de nuevo.';
        }
      });
    }
  }

  toggleMode() {
    this.setMode(!this.isLogin);
  }
}
