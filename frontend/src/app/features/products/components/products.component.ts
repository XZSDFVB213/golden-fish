import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { ProductItemComponent } from '../../../shared/ui/product-item/product-item.component';

import { ICategory } from '../../../shared/models/category/category.interface';
import { IProduct } from '../../../shared/models/product/product.interface';

import { ProductService } from '../../../features/products/service/product.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { StoreService } from '../../../core/services/store/store.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductItemComponent,
    MatIconModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private storeService = inject(StoreService);

  categories = signal<ICategory[]>([]);
  products = signal<IProduct[]>([]);

  selectedCategory = signal<string | null>(null);
  search = signal('');

  filteredProducts = computed(() => {
    const value = this.search()
      .trim()
      .toLowerCase();

    if (!value) {
      return this.products();
    }

    return this.products().filter(product =>
      product.title.toLowerCase().includes(value) ||
      product.description
        ?.toLowerCase()
        .includes(value),
    );
  });

  constructor() {
    effect(() => {
      const store = this.storeService.store();

      if (!store) {
        return;
      }

      this.categoryService
        .getByStoreId(store.id)
        .subscribe(categories => {
          this.categories.set(categories);
        });

      this.productService
        .getByStoreId(store.id)
        .subscribe(products => {
          this.products.set(products);
          this.selectedCategory.set(null);
        });
    });
  }

  loadCategory(categoryId: string) {
    this.selectedCategory.set(categoryId);

    this.productService
      .getByCategory(categoryId)
      .subscribe(products => {
        this.products.set(products);
      });
  }

  loadAllProducts() {
    const store = this.storeService.store();

    if (!store) {
      return;
    }

    this.selectedCategory.set(null);

    this.productService
      .getByStoreId(store.id)
      .subscribe(products => {
        this.products.set(products);
      });
  }

  resetFilters() {
    this.search.set('');
    this.loadAllProducts();
  }
}