import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../features/products/service/product.service';
import { CartService } from '../../features/cart/service/cart.service';

import { IProduct } from '../../shared/models/product/product.interface';

import { ProductItemComponent } from '../../shared/ui/product-item/product-item.component';

@Component({
  selector: 'app-product-detail',

  standalone: true,

  imports: [
    ProductItemComponent,
    MatIconModule,
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,

  templateUrl:
    './product-detail.component.html',

  styleUrl:
    './product-detail.component.scss',
})
export class ProductDetailComponent
  implements OnInit
{
  private route =
    inject(ActivatedRoute);

  private productService =
    inject(ProductService);

  private cartService =
    inject(CartService);

  product =
    signal<IProduct | null>(null);

  similarProducts =
    signal<IProduct[]>([]);

  quantity = computed(() => {
    const product = this.product();

    if (!product) {
      return 0;
    }

    const item = this.cartService
      .items()
      .find(
        item =>
          item.product.id === product.id,
      );

    return item?.quantity ?? 0;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');

        if (!id) {
          return;
        }

        this.loadProduct(id);
      },
    );
  }

  private loadProduct(id: string) {
    this.productService
      .getById(id)
      .subscribe(product => {
        this.product.set(product);
      });

    this.productService
      .getSimilar(id)
      .subscribe(products => {
        this.similarProducts.set(
          products,
        );
      });
  }

  addToCart(product: IProduct) {
    this.cartService.add(product);
  }

  increase() {
    const product = this.product();

    if (!product) {
      return;
    }

    this.cartService.increase(
      product.id,
    );
  }

  decrease() {
    const product = this.product();

    if (!product) {
      return;
    }

    this.cartService.decrease(
      product.id,
    );
  }
}