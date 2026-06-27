import { Component, inject } from '@angular/core';
import { EnumOrderStatus } from '../../../shared/models/order/order.interface';
import { OrderService } from '../../orders/service/order.service';
import { CartService } from '../service/cart.service';
import { Router, RouterLink } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatCard,MatIcon,RouterLink,MatButton,MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private router = inject(Router)
  cart = inject(CartService)
  checkout() {
    this.router.navigate(['checkout'])
  }
  
  increase(productId: string) {
  this.cart.increase(productId);
}

decrease(productId: string) {
  this.cart.decrease(productId);
}

remove(productId: string) {
  this.cart.remove(productId);
}
}
