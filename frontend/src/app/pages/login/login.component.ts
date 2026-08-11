import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;

  errorMessage = signal('');
  hidePassword = signal(true);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage.set('');

    this.authService
      .main('login', {
        name: '',
        ...this.form.getRawValue(),
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },

        error: (err) => {
          this.errorMessage.set(
            err.error?.message || 'Не удалось войти в аккаунт',
          );

          this.isLoading = false;
        },

        complete: () => {
          this.isLoading = false;
        },
      });
  }

  loginWithGoogle() {
    this.authService.googleLogin();
  }

  loginWithYandex() {
    this.authService.yandexLogin();
  }
}
