import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  IPaymentResponse,
  EnumOrderStatus,
  IOrder,
} from '../../../shared/models/order/order.interface';

import { ICartItem } from '../../../shared/models/cart/cart.interface';
import { environment } from '../../../core/environments/environment';

export interface IOrderItemRequest {
  productId: string;
  storeId: string;
  quantity: number;
  price: number;
}
interface ICreateOrder {
  items: IOrderItemRequest[];
  status: EnumOrderStatus;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  private API_URL = `${environment.API_URL}/orders`;

  createPayment(data: ICreateOrder) {
    return this.http.post<IPaymentResponse>(`${this.API_URL}/place`, data);
  }
  getAll() {
  return this.http.get<IOrder[]>(this.API_URL);
}
}
