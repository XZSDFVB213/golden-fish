import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../features/products/service/product.service';
import { IProduct } from '../../shared/models/product/product.interface';
import { ProductItemComponent } from '../../shared/ui/product-item/product-item.component';
import { MatButton } from '@angular/material/button';
import { CartService } from '../../features/cart/service/cart.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ProductItemComponent, MatButton, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<IProduct | null>(null);

  similarProducts = signal<IProduct[]>([]);
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.productService.getById(id).subscribe((product) => {
      this.product.set(product);
    });

    this.productService.getSimilar(id).subscribe((products) => {
      this.similarProducts.set(products);
    });
  }
  addToCart(product: IProduct) {
    this.cartService.add(product);
  }
}
