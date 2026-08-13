import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    MatIconModule,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  private authService = inject(AuthService);

  user = this.authService.user;

  favorites = computed(() => {
    return this.user()?.favorites ?? [];
  });
}