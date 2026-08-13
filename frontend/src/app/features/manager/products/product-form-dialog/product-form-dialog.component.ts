import {
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IProduct } from '../../../../shared/models/product/product.interface';
import { ICategory } from '../../../../shared/models/category/category.interface';
import { IStore } from '../../../../shared/models/store/store.interface';

import { ProductService } from '../../../../features/products/service/product.service';
import { CategoryService } from '../../../../core/services/category/category.service';
import { StoreService } from '../../../../core/services/store/store.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
export interface ProductDialogData {
  product?: IProduct;
}

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  templateUrl: './product-form-dialog.component.html',
  styleUrl: './product-form-dialog.component.scss',
})
export class ProductFormDialogComponent {
  private fb = inject(NonNullableFormBuilder);

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private storeService = inject(StoreService);

  private dialogRef =
    inject(MatDialogRef<ProductFormDialogComponent>);

  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  data = inject<ProductDialogData>(MAT_DIALOG_DATA);

  stores = signal<IStore[]>([]);
  categories = signal<ICategory[]>([]);

  loading = signal(false);

  isEdit = !!this.data.product;

  form = this.fb.group({
    title: [
      this.data.product?.title ?? '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],

    description: [
      this.data.product?.description ?? '',
    ],

    price: [
      this.data.product?.price ?? 0,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

    storeId: [
      this.data.product?.storeId ?? '',
      Validators.required,
    ],
    isWeighted: [
      this.data.product?.isWeighted ?? false,
      Validators.required,
    ],
    categoryId: [
      this.data.product?.categoryId ??
        this.data.product?.category?.id ??
        '',
      Validators.required,
    ],

    images: [
      this.data.product?.images?.join('\n') ?? '',
    ],
  });

  constructor() {
    if (this.isEdit) {
      this.form.controls.storeId.disable();
    }

    this.loadStores();

    this.form.controls.storeId.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(storeId => {
        if (!storeId) {
          return;
        }

        this.loadCategories(storeId);

        if (!this.isEdit) {
          this.form.controls.categoryId.setValue('');
        }
      });
  }

  private loadStores() {
    this.storeService
      .getAllManager()
      .subscribe(stores => {
        this.stores.set(stores);

        const currentStoreId =
          this.form.getRawValue().storeId;

        if (currentStoreId) {
          this.loadCategories(currentStoreId);
          return;
        }

        const firstStore = stores[0];

        if (firstStore) {
          this.form.controls.storeId.setValue(
            firstStore.id,
          );
        }
      });
  }

  private loadCategories(storeId: string) {
    this.categoryService
      .getByStoreId(storeId)
      .subscribe(categories => {
        this.categories.set(categories);
      });
  }

  get previewImage() {
    return this.form.controls.images.value
      .split(/\n|,/)
      .map(image => image.trim())
      .filter(Boolean)[0];
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const images = value.images
      .split(/\n|,/)
      .map(image => image.trim())
      .filter(Boolean);

    const payload = {
      title: value.title.trim(),
      description: value.description.trim(),
      price: Number(value.price),
      categoryId: value.categoryId,
      storeId: value.storeId,
      isWeighted: value.isWeighted,
      images,
    };

    this.loading.set(true);

    const request$ = this.data.product
      ? this.productService.update(
          this.data.product.id,
          payload,
        )
      : this.productService.create(
          value.storeId,
          payload,
        );

    request$.subscribe({
      next: product => {
        this.loading.set(false);

        this.snackBar.open(
          this.isEdit
            ? 'Товар обновлён'
            : 'Товар добавлен',
          'Закрыть',
          {
            duration: 2500,
          },
        );

        this.dialogRef.close(product);
      },

      error: () => {
        this.loading.set(false);

        this.snackBar.open(
          'Не удалось сохранить товар',
          'Закрыть',
          {
            duration: 3000,
          },
        );
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}