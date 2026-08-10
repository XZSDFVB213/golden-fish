import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';

import { IStore } from '../../shared/models/store/store.interface';
import { StoreService } from '../../core/services/store/store.service';
import { CartService } from '../../features/cart/service/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,

    MatIconModule,
    MatBadgeModule,
    MatSelectModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private storeService = inject(StoreService);
  private cartService = inject(CartService);
  private router = inject(Router);

  totalCount = this.cartService.totalCount;

  search = signal('');

  stores = signal<IStore[]>([
    {
      id: 'cmq3qjnto00018w94ty3jx96g',
      title: 'Золотая рыбка - Центр',
      description: 'Описание',
    } as IStore,
    {
      id: 'cmq3qkcar00038w94ouiakoxa',
      title: 'Золотая рыбка - Северный',
      description: 'Описание',
    } as IStore,
  ]);

  selectedStoreId = signal(
    'cmq3qjnto00018w94ty3jx96g',
  );

  constructor() {
    if (!this.storeService.store()) {
      const store = this.stores()[0];

      if (store) {
        this.storeService.setStore(store);
      }
    }
  }

  onStoreChange(storeId: string) {
    this.selectedStoreId.set(storeId);

    const store = this.stores().find(
      store => store.id === storeId,
    );

    if (store) {
      this.storeService.setStore(store);
    }
  }

  searchProducts() {
    const value = this.search().trim();

    this.router.navigate(['/products'], {
      queryParams: value
        ? { search: value }
        : undefined,
    });
  }
}