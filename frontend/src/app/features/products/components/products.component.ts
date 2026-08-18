import { Component, computed, effect, inject, signal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { ProductItemComponent } from '../../../shared/ui/product-item/product-item.component';

import { ICategory } from '../../../shared/models/category/category.interface';
import { IProduct } from '../../../shared/models/product/product.interface';

import { ProductService } from '../../../features/products/service/product.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { StoreService } from '../../../core/services/store/store.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ProductFilterDialogComponent,
  ProductFilters,
} from '../dialog/product-filter-dialog/product-filter-dialog.component';

type CatalogTab = 'ALL' | 'POPULAR' | 'NEW' | 'SALE';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductItemComponent, MatIconModule],
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
  private dialog = inject(MatDialog);
  activeTab = signal<CatalogTab>('ALL');
  filters = signal<ProductFilters>({
    categoryId: null,
    minPrice: 0,

    maxPrice: Number.MAX_SAFE_INTEGER,

    weighted: null,
  });
  private getMaxPrice(products: IProduct[]) {
    if (!products.length) {
      return 0;
    }

    return (
      Math.ceil(
        Math.max(...products.map((product) => Number(product.price))) / 100,
      ) * 100
    );
  }
  filteredProducts = computed(() => {
    const products = this.products();

    const search = this.search().trim().toLowerCase();

    const category = this.selectedCategory();

    const filters = this.filters();

    return products.filter((product) => {
      /* SEARCH */

      const matchesSearch =
        !search ||
        product.title.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search);

      /* CATEGORY */

      const filterCategory = filters.categoryId ?? category;

      const matchesCategory =
        !filterCategory ||
        product.categoryId === filterCategory ||
        product.category?.id === filterCategory;

      /* PRICE */

      const price = Number(product.price);

      const matchesPrice =
        price >= filters.minPrice && price <= filters.maxPrice;

      /* WEIGHTED */

      const matchesWeighted =
        filters.weighted === null || product.isWeighted === filters.weighted;

      return (
        matchesSearch && matchesCategory && matchesPrice && matchesWeighted
      );
    });
  });
  openFilters() {
    const ref = this.dialog.open(ProductFilterDialogComponent, {
      width: '430px',

      maxWidth: 'calc(100vw - 24px)',

      maxHeight: 'calc(100vh - 30px)',

      autoFocus: false,

      panelClass: 'catalog-filter-dialog',

      data: {
        categories: this.categories(),

        filters: this.filters(),

        availableMaxPrice: this.getMaxPrice(this.products()),
      },
    });

    ref.afterClosed().subscribe((result: ProductFilters | undefined) => {
      if (!result) {
        return;
      }

      this.filters.set(result);

      if (result.categoryId) {
        this.loadCategory(result.categoryId);
      } else {
        this.loadAllProducts();
      }
    });
  }
  loading = signal(true);

  constructor() {
    effect(() => {
      const store = this.storeService.store();

      if (!store) {
        return;
      }

      this.loading.set(true);

      this.categoryService.getByStoreId(store.id).subscribe((categories) => {
        this.categories.set(categories);
      });

      this.productService.getByStoreId(store.id).subscribe({
        next: (products) => {
          this.products.set(products);

          this.selectedCategory.set(null);

          this.filters.set({
            categoryId: null,
            minPrice: 0,

            maxPrice: this.getMaxPrice(products),

            weighted: null,
          });

          this.loading.set(false);
        },

        error: () => {
          this.loading.set(false);
        },
      });
    });
  }
  loadCategory(categoryId: string) {
    this.selectedCategory.set(categoryId);
  }

  loadAllProducts() {
    this.selectedCategory.set(null);
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

      this.productService.getMostPopular().subscribe((products) => {
        this.products.set(
          products.filter((product) => product.storeId === store.id),
        );
      });

      return;
    }

    if (tab === 'NEW') {
      this.selectedCategory.set(null);

      this.productService.getByStoreId(store.id).subscribe((products) => {
        this.products.set([...products].reverse());
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
    const title = category.title.toLowerCase().trim();

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

    if (title.includes('молоч') || title.includes('сыр')) {
      return 'assets/categories/milk.webp';
    }

    if (title.includes('напит') || title.includes('вода')) {
      return 'assets/categories/drinks.webp';
    }

    if (title.includes('икр')) {
      return 'assets/categories/caviar.webp';
    }

    if (title.includes('кулинар') || title.includes('готов')) {
      return 'assets/categories/cooking.webp';
    }

    return 'assets/categories/default.webp';
  }
}
