import { Component, inject, signal } from '@angular/core';
import {
  EnumOrderStatus,
  IOrder,
} from '../../../shared/models/order/order.interface';
import { OrdersManagerService } from './service/orders-manager.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatOptionModule, MatSelectModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersManagerComponent {
  private orderService = inject(OrdersManagerService);
  orders = signal<IOrder[]>([]);
  EnumOrderStatus = EnumOrderStatus;

  constructor() {
    this.load();
  }

  load() {
    this.orderService.getAll().subscribe((res) => {
      this.orders.set(res);
    });
  }

  filter(status: string) {
    this.orderService.getAll().subscribe((res) => {
      this.orders.set(res.filter((o) => o.status === status));
    });
  }

  setStatus(orderId: string, status: EnumOrderStatus) {
    this.orderService.updateStatus(orderId, status).subscribe(() => {
      this.load();
    });
  }
}
