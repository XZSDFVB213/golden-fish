import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { IStore } from '../../shared/models/store/store.interface';
import { StoreService } from '../../core/services/store/store.service';
import { CartService } from '../../features/cart/service/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,

    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private storeService = inject(StoreService);
  private cartService = inject(CartService);
  totalCount = this.cartService.totalCount
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

  selectedStoreId = signal('cmq3qjnto00018w94ty3jx96g');
  onStoreChange(storeId: string) {
  this.selectedStoreId.set(storeId);

  const store = this.stores().find((s) => s.id === storeId);

  if (store) {
    this.storeService.setStore(store);
  }
}
}
