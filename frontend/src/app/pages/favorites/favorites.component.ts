import {
  Component,
  inject,
  signal,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { IProduct } from '../../shared/models/product/product.interface';
import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  private userService = inject(UserService);

  favorites = signal<IProduct[]>([]);

  loading = signal(true);

  constructor() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading.set(true);

    this.userService
      .getProfile()
      .subscribe({
        next: user => {
          this.favorites.set(
            user.favorites ?? [],
          );
        },

        error: err => {
          console.error(
            'Ошибка загрузки избранного',
            err,
          );
        },

        complete: () => {
          this.loading.set(false);
        },
      });
  }
}