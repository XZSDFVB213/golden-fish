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
  private sortCategories(categories: ICategory[]) {
    const order: Record<string, number> = {
      рыба: 1,
      морепродукты: 2,
      икра: 3,
      мясо: 4,
      напитки: 5,
      'молочные продукты': 6,
    };

    return [...categories].sort((a, b) => {
      const aOrder = order[a.title.toLowerCase().trim()] ?? 999;

      const bOrder = order[b.title.toLowerCase().trim()] ?? 999;

      return aOrder - bOrder;
    });
  }
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
         this.categories.set(
    this.sortCategories(categories),
  );
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
