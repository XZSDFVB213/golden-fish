import { Injectable, computed, effect, signal } from '@angular/core';
import { ICartItem } from '../../../shared/models/cart/cart.interface';
import { IProduct } from '../../../shared/models/product/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'cart';

  items = signal<ICartItem[]>(this.loadCart());

  constructor() {
    effect(() => {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.items()),
      );
    });
  }

  private loadCart(): ICartItem[] {
    const cart = localStorage.getItem(this.STORAGE_KEY);

    if (!cart) return [];

    try {
      return JSON.parse(cart);
    } catch {
      return [];
    }
  }

  add(product: IProduct) {
    const existing = this.items().find(
      (item) => item.product.id === product.id,
    );

    if (existing) {
      this.items.update((items) =>
        items.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      );

      return;
    }

    this.items.update((items) => [
      ...items,
      {
        id: Date.now(),
        product,
        quantity: 1,
        price: product.price,
        storeId: product.storeId
      },
    ]);
  }

  remove(productId: string) {
    this.items.update((items) =>
      items.filter((item) => item.product.id !== productId),
    );
  }

  increase(productId: string) {
    this.items.update((items) =>
      items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  decrease(productId: string) {
    this.items.update((items) =>
      items
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }



  totalPrice = computed(() =>
    this.items().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
  );

  totalCount = computed(() =>
    this.items().reduce(
      (sum, item) => sum + item.quantity,
      0,
    ),
  );
  clear() {
  this.items.set([]);
  localStorage.removeItem(this.STORAGE_KEY);
}
}