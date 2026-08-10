import { Component, computed, inject, signal } from '@angular/core';

import { DatePipe, DecimalPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  EnumOrderStatus,
  IOrder,
} from '../../../shared/models/order/order.interface';

import { OrdersManagerService } from './service/orders-manager.service';

type OrderFilter = EnumOrderStatus | 'ALL';

@Component({
  selector: 'app-orders-manager',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, DatePipe, DecimalPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersManagerComponent {
  private ordersService = inject(OrdersManagerService);

  orders = signal<IOrder[]>([]);
  selectedFilter = signal<OrderFilter>('ALL');
  EnumOrderStatus = EnumOrderStatus;
  filters: {
    label: string;
    value: OrderFilter;
  }[] = [
    {
      label: 'Все',
      value: 'ALL',
    },
    {
      label: 'Новые',
      value: EnumOrderStatus.PENDING,
    },
    {
      label: 'Оплачены',
      value: EnumOrderStatus.PAYED,
    },
    {
      label: 'Собираются',
      value: EnumOrderStatus.PROCESSING,
    },
    {
      label: 'Готовы',
      value: EnumOrderStatus.READY,
    },
    {
      label: 'Доставка',
      value: EnumOrderStatus.DELIVERY,
    },
    {
      label: 'Завершены',
      value: EnumOrderStatus.COMPLETED,
    },
  ];

  filteredOrders = computed(() => {
    const filter = this.selectedFilter();

    if (filter === 'ALL') {
      return this.orders();
    }

    return this.orders().filter((order) => order.status === filter);
  });

  totalRevenue = computed(() =>
    this.orders()
      .filter((order) => order.status !== EnumOrderStatus.CANCELED)
      .reduce((sum, order) => sum + order.total, 0),
  );

  activeCount = computed(
    () =>
      this.orders().filter((order) =>
        [
          EnumOrderStatus.PENDING,
          EnumOrderStatus.PAYED,
          EnumOrderStatus.PROCESSING,
          EnumOrderStatus.READY,
          EnumOrderStatus.DELIVERY,
        ].includes(order.status),
      ).length,
  );

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getAll().subscribe((orders) => {
      this.orders.set(orders);
    });
  }

  selectFilter(filter: OrderFilter) {
    this.selectedFilter.set(filter);
  }

  getCount(filter: OrderFilter) {
    if (filter === 'ALL') {
      return this.orders().length;
    }

    return this.orders().filter((order) => order.status === filter).length;
  }

  setStatus(orderId: string, status: EnumOrderStatus) {
    this.ordersService.updateStatus(orderId, status).subscribe(() => {
      this.loadOrders();
    });
  }

  getStatusLabel(status: EnumOrderStatus) {
    switch (status) {
      case EnumOrderStatus.PENDING:
        return 'Новый';

      case EnumOrderStatus.PAYED:
        return 'Оплачен';

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

      default:
        return status;
    }
  }

  getStatusClass(status: EnumOrderStatus) {
    return status.toLowerCase();
  }

  getNextAction(status: EnumOrderStatus) {
    switch (status) {
      case EnumOrderStatus.PENDING:
      case EnumOrderStatus.PAYED:
        return {
          label: 'Начать сборку',
          icon: 'inventory_2',
          status: EnumOrderStatus.PROCESSING,
        };

      case EnumOrderStatus.PROCESSING:
        return {
          label: 'Заказ собран',
          icon: 'check_circle',
          status: EnumOrderStatus.READY,
        };

      case EnumOrderStatus.READY:
        return {
          label: 'Передать в доставку',
          icon: 'local_shipping',
          status: EnumOrderStatus.DELIVERY,
        };

      case EnumOrderStatus.DELIVERY:
        return {
          label: 'Завершить заказ',
          icon: 'done_all',
          status: EnumOrderStatus.COMPLETED,
        };

      default:
        return null;
    }
  }
}
