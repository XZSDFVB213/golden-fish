import { Component, inject, signal } from '@angular/core';
import { IOrder } from '../../../shared/models/order/order.interface';
import { OrderService } from '../service/order.service';
import { MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatCard, MatButtonModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
 private orderService = inject(OrderService);

  orders = signal<IOrder[]>([]);

  constructor() {
    this.orderService.getAll().subscribe((res) => {
      this.orders.set(res);
    });
  }
}
