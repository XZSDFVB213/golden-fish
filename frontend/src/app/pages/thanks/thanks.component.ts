import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { CartService } from '../../features/cart/service/cart.service';

@Component({
  selector: 'app-thanks',
  standalone: true,
  imports: [MatCard, MatButtonModule, RouterLink],
  templateUrl: './thanks.component.html',
  styleUrl: './thanks.component.scss',
})
export class ThanksComponent implements OnInit {
  private cartService = inject(CartService);

  ngOnInit() {
    this.cartService.clear();
  }
}
