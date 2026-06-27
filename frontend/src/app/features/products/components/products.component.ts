import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ProductService } from '../service/product.service';
import { StoreService } from '../../../core/services/store/store.service';
import { IProduct } from '../../../shared/models/product/product.interface';
import { ICategory } from '../../../shared/models/category/category.interface';
import { CategoryService } from '../../../core/services/category/category.service';
import { CategoryCardComponent } from '../../../shared/ui/category-card/category-card.component';
import { ProductItemComponent } from '../../../shared/ui/product-item/product-item.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-products',
  imports: [CategoryCardComponent,ProductItemComponent,CategoryCardComponent,MatButton],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private storeService = inject(StoreService);
  private categoryService = inject(CategoryService);
  categories = signal<ICategory[]>([]);

  selectedCategory = signal<string | null>(null);
  products = signal<IProduct[]>([]);

  constructor() {
    effect(() => {
      const store = this.storeService.store();

      if (!store) return;

      this.productService.getByStoreId(store.id).subscribe((products) => {
        this.products.set(products);
      });
      this.categoryService.getByStoreId(store.id).subscribe((categories) => {
        this.categories.set(categories);
      });
    });
  }

  loadCategory(id: string) {
  this.selectedCategory.set(id);

  this.productService
    .getByCategory(id)
    .subscribe(products => {
      this.products.set(products);
    });
}

  loadAllProducts() {
    this.selectedCategory.set(null);
  }
}
