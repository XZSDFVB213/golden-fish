import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { forkJoin } from 'rxjs';

import { CategoryService } from '../../../../core/services/category/category.service';
import { StoreService } from '../../../../core/services/store/store.service';
import { ProductService } from '../../../../features/products/service/product.service';

import { ICategory } from '../../../../shared/models/category/category.interface';
import { IProduct } from '../../../../shared/models/product/product.interface';
import { IStore } from '../../../../shared/models/store/store.interface';

import {
  CategoryFormDialogComponent,
} from '../category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  private storeService = inject(StoreService);
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);

  categories = signal<ICategory[]>([]);
  stores = signal<IStore[]>([]);
  products = signal<IProduct[]>([]);

  search = signal('');

  filteredCategories = computed(() => {
    const search = this.search()
      .trim()
      .toLowerCase();

    if (!search) {
      return this.categories();
    }

    return this.categories().filter(category =>
      category.title.toLowerCase().includes(search) ||
      category.description
        ?.toLowerCase()
        .includes(search),
    );
  });

  constructor() {
    this.loadData();
  }

  loadData() {
    this.productService
      .getAll()
      .subscribe(products => {
        this.products.set(products);
      });

    this.storeService
      .getAllManager()
      .subscribe(stores => {
        this.stores.set(stores);

        if (!stores.length) {
          this.categories.set([]);
          return;
        }

        forkJoin(
          stores.map(store =>
            this.categoryService.getByStoreId(store.id),
          ),
        ).subscribe(result => {
          this.categories.set(result.flat());
        });
      });
  }

  getProductsCount(categoryId: string) {
    return this.products().filter(
      product =>
        product.categoryId === categoryId ||
        product.category?.id === categoryId,
    ).length;
  }

  getStoreName(storeId: string) {
    const store = this.stores().find(
      store => store.id === storeId,
    );

    return store?.title ?? 'Магазин';
  }

  openCreate() {
    const ref = this.dialog.open(
      CategoryFormDialogComponent,
      {
        width: '620px',
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'category-dialog-panel',
        data: {
          stores: this.stores(),
        },
      },
    );

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  openEdit(category: ICategory) {
    const ref = this.dialog.open(
      CategoryFormDialogComponent,
      {
        width: '620px',
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'category-dialog-panel',

        data: {
          category,
          stores: this.stores(),
        },
      },
    );

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteCategory(category: ICategory) {
    const count = this.getProductsCount(category.id);

    if (count > 0) {
      alert(
        `В категории находится ${count} товаров. Сначала перенесите или удалите их.`,
      );

      return;
    }

    const confirmed = confirm(
      `Удалить категорию «${category.title}»?`,
    );

    if (!confirmed) {
      return;
    }

    this.categoryService
      .delete(category.id)
      .subscribe(() => {
        this.categories.update(categories =>
          categories.filter(
            item => item.id !== category.id,
          ),
        );
      });
  }
}