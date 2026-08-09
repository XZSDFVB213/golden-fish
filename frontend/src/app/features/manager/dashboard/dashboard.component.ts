import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  EnumOrderStatus,
  IOrder,
} from '../../../shared/models/order/order.interface';

import { DashboardService } from './service/dashboard.service';
import { OrdersManagerService } from '../orders/service/orders-manager.service';

export interface IManagerDashboard {
  todayOrders: number;
  revenue: number;
  pending: number;
  ready: number;
  processing: number;
  delivery: number;
  completed: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private dashboardService = inject(DashboardService);
  private ordersService = inject(OrdersManagerService);

  dashboard = signal<IManagerDashboard | null>(null);
  orders = signal<IOrder[]>([]);

  today = new Date();

  activeOrders = computed(() =>
    this.orders()
      .filter((order) =>
        [
          EnumOrderStatus.PENDING,
          EnumOrderStatus.PROCESSING,
          EnumOrderStatus.READY,
          EnumOrderStatus.DELIVERY,
        ].includes(order.status),
      )
      .slice(0, 4),
  );

  latestOrders = computed(() => this.orders().slice(0, 5));

  attentionCount = computed(
    () =>
      this.orders().filter((order) => order.status === EnumOrderStatus.PENDING)
        .length,
  );

  constructor() {
    this.loadDashboard();
    this.loadOrders();
  }

  private loadDashboard() {
    this.dashboardService.getDashboard().subscribe((data) => {
      this.dashboard.set(data);
    });
  }

  private loadOrders() {
    this.ordersService.getAll().subscribe((data) => {
      this.orders.set(data);
    });
  }

  getStatusLabel(status: EnumOrderStatus) {
    switch (status) {
      case EnumOrderStatus.PENDING:
        return 'Новый';

      case EnumOrderStatus.PROCESSING:
        return 'Собирается';

      case EnumOrderStatus.READY:
        return 'Готов';

      case EnumOrderStatus.DELIVERY:
        return 'В доставке';

      case EnumOrderStatus.COMPLETED:
        return 'Завершён';

      case EnumOrderStatus.CANCELED:
        return 'Отменён';

      case EnumOrderStatus.PAYED:
        return 'Оплачен';

      default:
        return status;
    }
  }

  getStatusClass(status: EnumOrderStatus) {
    return status.toLowerCase();
  }
}
