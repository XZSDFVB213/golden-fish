import {
  Component,
  computed,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CartService } from '../../features/cart/service/cart.service';
import { OrderService } from '../../features/orders/service/order.service';
import { EnumOrderStatus } from '../../shared/models/order/order.interface';

import { MatRadioModule } from '@angular/material/radio';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkout',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatFormField,
    MatInput,
    MatIconModule,
  ],

  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart = inject(CartService);

  private orderService =
    inject(OrderService);

  private fb =
    inject(FormBuilder);

  form = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
      ],
    ],

    comment: [''],

    deliveryType: [
      'courier',
      Validators.required,
    ],
  });

  totalPrice =
    this.cart.totalPrice;

  hasWeightedProducts = computed(() =>
    this.cart
      .items()
      .some(
        item =>
          item.product.isWeighted,
      ),
  );

  totalLabel = computed(() =>
    this.hasWeightedProducts()
      ? 'Предварительный итог'
      : 'Итого',
  );

  pay() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    if (!this.cart.items().length) {
      return;
    }

    const formValue =
      this.form.getRawValue();

    console.log(
      'CHECKOUT FORM:',
      formValue,
    );

    const items =
      this.cart.items().map(
        item => ({
          productId:
            item.product.id,

          storeId:
            item.product.storeId,

          quantity:
            item.quantity,

          price:
            item.price,
        }),
      );

    this.orderService
      .createPayment({
        items,

        status:
          EnumOrderStatus.PENDING,
      })
      .subscribe(res => {
        window.location.href =
          res.confirmation.confirmation_url;
      });
  }
}