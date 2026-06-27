import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../core/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EnumOrderStatus, IOrder } from '../../../../shared/models/order/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersManagerService {
  private http = inject(HttpClient)
  private apiUrl = environment.API_URL;
  getAll() {
    return this.http.get<IOrder[]>(`${this.apiUrl}/orders/manager/all`);
  }

  updateStatus(orderId: string, status: EnumOrderStatus) {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }
}
