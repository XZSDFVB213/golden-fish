import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { IOrder } from '../../../shared/models/order/order.interface';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private orderService = inject(OrderService);

  orders = signal<IOrder[]>([]);

  totalSpent = computed(() =>
    this.orders().reduce(
      (sum, order) => sum + order.total,
      0,
    ),
  );

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAll().subscribe(res => {
      this.orders.set(res);
    });
  }

  getStatusLabel(status: string) {
    const statuses: Record<string, string> = {
      PENDING: 'Ожидает оплаты',
      PAYED: 'Оплачен',
      PROCESSING: 'Собираем заказ',
      READY: 'Заказ готов',
      DELIVERY: 'В пути',
      COMPLETED: 'Доставлен',
      CANCELED: 'Отменён',
    };

    return statuses[status] ?? status;
  }

  getStatusClass(status: string) {
    return status.toLowerCase();
  }

  getStatusIcon(status: string) {
    const icons: Record<string, string> = {
      PENDING: 'schedule',
      PAYED: 'payments',
      PROCESSING: 'inventory_2',
      READY: 'check_circle',
      DELIVERY: 'local_shipping',
      COMPLETED: 'verified',
      CANCELED: 'cancel',
    };

    return icons[status] ?? 'receipt_long';
  }
}