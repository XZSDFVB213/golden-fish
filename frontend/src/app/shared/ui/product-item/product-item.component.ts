import { Component, inject, Input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { IProduct } from '../../models/product/product.interface';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [MatCardActions, MatCardContent, MatCard, RouterLink,MatButton],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() product!: IProduct;
  private router = inject(Router);

  goToProduct(id: string) {
    this.router.navigate(['products', id]);
  }
}
