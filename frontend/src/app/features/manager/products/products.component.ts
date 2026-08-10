import { Component, computed, inject, signal } from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../../features/products/service/product.service';
import { IProduct } from '../../../shared/models/product/product.interface';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';

type CategoryFilter = string | 'ALL';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, DecimalPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog)
  products = signal<IProduct[]>([]);

  search = signal('');
  selectedCategory = signal<CategoryFilter>('ALL');
  getCategoryCount(categoryId: string) {
    return this.products().filter(
      (product) => product.category?.id === categoryId,
    ).length;
  }
 
  categories = computed(() => {
    const map = new Map<
      string,
      {
        id: string;
        title: string;
      }
    >();

    for (const product of this.products()) {
      if (product.category) {
        map.set(product.category.id, {
          id: product.category.id,
          title: product.category.title,
        });
      }
    }

    return Array.from(map.values());
  });

  storesCount = computed(() => {
    return new Set(
      this.products()
        .map((product) => product.storeId)
        .filter(Boolean),
    ).size;
  });

  averagePrice = computed(() => {
    const products = this.products();

    if (!products.length) {
      return 0;
    }

    const total = products.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    return total / products.length;
  });

  filteredProducts = computed(() => {
    const search = this.search().trim().toLowerCase();

    const category = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesSearch =
        !search ||
        product.title.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search);

      const matchesCategory =
        category === 'ALL' || product.category?.id === category;

      return matchesSearch && matchesCategory;
    });
  });

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe((products) => {
      this.products.set(products);
    });
  }

  selectCategory(category: CategoryFilter) {
    this.selectedCategory.set(category);
  }

  deleteProduct(product: IProduct) {
    const confirmed = confirm(`Удалить товар «${product.title}»?`);

    if (!confirmed) {
      return;
    }

    this.productService.delete(product.id).subscribe(() => {
      this.products.update((products) =>
        products.filter((item) => item.id !== product.id),
      );
    });
  }
   openCreateProduct() {
  const ref = this.dialog.open(
    ProductFormDialogComponent,
    {
      width: '850px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'product-dialog-panel',
      data: {},
    },
  );

  ref.afterClosed().subscribe(result => {
    if (result) {
      this.loadProducts();
    }
  });
}
openEditProduct(product: IProduct) {
  const ref = this.dialog.open(
    ProductFormDialogComponent,
    {
      width: '850px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'product-dialog-panel',

      data: {
        product,
      },
    },
  );

  ref.afterClosed().subscribe(result => {
    if (result) {
      this.loadProducts();
    }
  });
}
}
