import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatButton,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;

  initial = computed(() => {
    return this.user()?.name
      ?.charAt(0)
      .toUpperCase() ?? 'П';
  });

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}