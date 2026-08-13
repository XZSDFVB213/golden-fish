import { Component, inject } from '@angular/core';
import { CartService } from '../../features/cart/service/cart.service';
import { OrderService } from '../../features/orders/service/order.service';
import { EnumOrderStatus } from '../../shared/models/order/order.interface';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatCard,
    MatLabel,
    MatRadioModule,
    MatFormField,
    MatInput,
    MatButton,
    MatIconModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart = inject(CartService);
  private orderService = inject(OrderService);

  totalPrice = this.cart.totalPrice;
 pay() {
  const items = this.cart.items().map(item => ({
    productId: item.product.id,
    storeId: item.product.storeId,
    quantity: item.quantity,
    price: item.price,
  }));

  console.log(items);

  this.orderService.createPayment({
    items,
    status: EnumOrderStatus.PENDING,
  }).subscribe(res => {
    window.location.href =
      res.confirmation.confirmation_url;
  });
}
}
