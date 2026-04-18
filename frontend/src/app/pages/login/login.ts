import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../types/user.model';
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['adoptante', Validators.required],
      organization: [''],
      phone: ['']
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
    this.registerForm.patchValue({ userType: type });
  }

  // Cambiar entre login y registro
  setMode(isLogin: boolean) {
    this.isLogin = isLogin;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        mode: isLogin ? 'login' : 'register'
      },
      queryParamsHandling: 'merge'
    });
  }

  // LOGIN
onLogin() {
  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (res) => {
      if (res.rol === 'protectora') {
        this.router.navigate(['/panel-protectora']);
      } else {
        this.router.navigate(['/adoptar']);
      }
    },
    error: (err) => {
      console.error('Error en login:', err);
    }
  });
}

  // REGISTER
  onRegister() {
    if (this.registerForm.invalid) return;

    const formValue = this.registerForm.value;

    const user: User = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      userType: this.userType,
      organization: this.userType === 'protectora' ? formValue.organization : undefined,
      phone: this.userType === 'protectora' ? formValue.phone : undefined
    };

    console.log('USER:', user);
  }

  toggleMode() {
  this.setMode(!this.isLogin);
}
}