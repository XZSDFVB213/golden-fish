import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth/auth.service';
import { OrdersManagerService } from '../orders/service/orders-manager.service';
import { EnumOrderStatus } from '../../../shared/models/order/order.interface';

@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class ManagerLayoutComponent {
  private authService = inject(AuthService);
  private ordersService = inject(OrdersManagerService);
  private router = inject(Router);

  user = this.authService.user;

  sidebarCollapsed = signal(false);

  pendingOrders = signal(0);

  menu = [
    {
      label: 'Dashboard',
      icon: 'space_dashboard',
      route: '/manager/dashboard',
    },
    {
      label: 'Заказы',
      icon: 'receipt_long',
      route: '/manager/orders',
      badge: true,
    },
    {
      label: 'Товары',
      icon: 'inventory_2',
      route: '/manager/products',
    },
    {
      label: 'Категории',
      icon: 'category',
      route: '/manager/categories',
    },
    {
      label: 'Магазины',
      icon: 'storefront',
      route: '/manager/stores',
    },
  ];

  userInitial = computed(() => {
    return (
      this.user()?.name?.charAt(0).toUpperCase() ??
      'М'
    );
  });

  constructor() {
    this.loadOrderBadge();
  }

  private loadOrderBadge() {
    this.ordersService.getAll().subscribe(orders => {
      this.pendingOrders.set(
        orders.filter(
          order =>
            order.status ===
            EnumOrderStatus.PENDING,
        ).length,
      );
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(
      value => !value,
    );
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}