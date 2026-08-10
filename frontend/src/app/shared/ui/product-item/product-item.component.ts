import {
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { IProduct } from '../../models/product/product.interface';

// путь подставь свой
import { CartService } from '../../../features/cart/service/cart.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    DecimalPipe,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  private cart = inject(CartService);

  product = input.required<IProduct>();

  favorite = signal(false);

  quantity = computed(() => {
    const item = this.cart
      .items()
      .find(
        item =>
          item.product.id ===
          this.product().id,
      );

    return item?.quantity ?? 0;
  });

  toggleFavorite(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.favorite.update(
      value => !value,
    );
  }

  add(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.cart.add(this.product());
  }

  increase(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.cart.increase(
      this.product().id,
    );
  }

  decrease(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.cart.decrease(
      this.product().id,
    );
  }
}