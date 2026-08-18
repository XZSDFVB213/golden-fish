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

type CatalogTab =
  | 'ALL'
  | 'POPULAR'
  | 'NEW'
  | 'SALE';

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

  activeTab = signal<CatalogTab>('ALL');

  filteredProducts = computed(() => {
    const value = this.search()
      .trim()
      .toLowerCase();

    if (!value) {
      return this.products();
    }

    return this.products().filter(product =>
      product.title
        .toLowerCase()
        .includes(value) ||
      product.description
        ?.toLowerCase()
        .includes(value),
    );
  });

  constructor() {
    effect(() => {
      const store = this.storeService.store();

      if (!store) {
        this.categories.set([]);
        this.products.set([]);
        return;
      }

      this.categoryService
        .getByStoreId(store.id)
        .subscribe(categories => {
          this.categories.set(categories);
        });

      this.loadAllProducts();
    });
  }

  loadCategory(categoryId: string) {
    this.selectedCategory.set(categoryId);
    this.activeTab.set('ALL');

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

  selectTab(tab: CatalogTab) {
    this.activeTab.set(tab);

    const store = this.storeService.store();

    if (!store) {
      return;
    }

    if (tab === 'ALL') {
      this.loadAllProducts();
      return;
    }

    if (tab === 'POPULAR') {
      this.selectedCategory.set(null);

      this.productService
        .getMostPopular()
        .subscribe(products => {
          this.products.set(
            products.filter(
              product =>
                product.storeId === store.id,
            ),
          );
        });

      return;
    }

    if (tab === 'NEW') {
      this.selectedCategory.set(null);

      this.productService
        .getByStoreId(store.id)
        .subscribe(products => {
          this.products.set(
            [...products].reverse(),
          );
        });

      return;
    }

    // SALE пока оставляем визуально.
    // Когда добавишь discount/oldPrice —
    // здесь сделаем нормальную фильтрацию.
  }

  resetFilters() {
    this.search.set('');
    this.activeTab.set('ALL');
    this.loadAllProducts();
  }

  getCategoryImage(category: ICategory) {
    const title = category.title
      .toLowerCase()
      .trim();

    if (title.includes('рыб')) {
      return 'assets/categories/fish-category.webp';
    }

    if (
      title.includes('морепродукт') ||
      title.includes('кревет') ||
      title.includes('кальмар')
    ) {
      return 'assets/categories/seafood.webp';
    }

    if (title.includes('мяс')) {
      return 'assets/categories/meat.webp';
    }

    if (
      title.includes('молоч') ||
      title.includes('сыр')
    ) {
      return 'assets/categories/milk.webp';
    }

    if (
      title.includes('напит') ||
      title.includes('вода')
    ) {
      return 'assets/categories/drinks.webp';
    }

    if (title.includes('икр')) {
      return 'assets/categories/caviar.webp';
    }

    if (
      title.includes('кулинар') ||
      title.includes('готов')
    ) {
      return 'assets/categories/cooking.webp';
    }

    return 'assets/categories/default.webp';
  }
}