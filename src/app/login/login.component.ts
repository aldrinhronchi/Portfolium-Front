import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserAuthenticateRequest } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Redirecionar se já estiver logado
    if (this.authService.isAuthenticatedValue) {
      this.router.navigate(['/home']);
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials: UserAuthenticateRequest = {
      Email: this.f['email'].value,
      Password: this.f['password'].value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/home']);
        } else {
          this.error = response.message || 'Erro ao fazer login';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.friendlyMessage || 'Erro ao conectar com o servidor';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
} 