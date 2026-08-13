import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;

  errorMessage = signal('');
  hidePassword = signal(true);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],

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
      .main('register', {
        ...this.form.getRawValue(),
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },

        error: (err) => {
          this.errorMessage.set(
            err.error?.message || 'Не удалось создать аккаунт',
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
