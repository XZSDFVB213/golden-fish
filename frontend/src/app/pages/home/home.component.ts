import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { ProductItemComponent } from '../../shared/ui/product-item/product-item.component';
import { CategoryCardComponent } from '../../shared/ui/category-card/category-card.component';
import { HeroBannerComponent } from '../../shared/ui/hero-banner/hero-banner.component';

import { IProduct } from '../../shared/models/product/product.interface';
import { ICategory } from '../../shared/models/category/category.interface';

import { ProductService } from '../../features/products/service/product.service';
import { CategoryService } from '../../core/services/category/category.service';
import { StoreService } from '../../core/services/store/store.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,

    ProductItemComponent,
    CategoryCardComponent,
    HeroBannerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private productService = inject(ProductService);
  private storeService = inject(StoreService);
  private categoryService = inject(CategoryService);

  categories = signal<ICategory[]>([]);
  popularProducts = signal<IProduct[]>([]);
  newProducts = signal<IProduct[]>([]);

  constructor() {
    effect(() => {
      const store = this.storeService.store();

      if (!store) {
        this.categories.set([]);
        this.popularProducts.set([]);
        this.newProducts.set([]);
        return;
      }

      this.categoryService.getByStoreId(store.id).subscribe((categories) => {
        this.categories.set(categories.slice(0, 4));
      });

      this.productService.getByStoreId(store.id).subscribe((products) => {
        this.newProducts.set(products.slice(0, 8));
      });

      this.productService.getMostPopular().subscribe((products) => {
        this.popularProducts.set(
          products
            .filter((product) => product.storeId === store.id)
            .slice(0, 8),
        );
      });
    });
  }
}
