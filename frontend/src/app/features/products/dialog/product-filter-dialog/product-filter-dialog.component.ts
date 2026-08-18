import {
  Component,
  inject,
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';

import { ICategory } from '../../../../shared/models/category/category.interface';

export interface ProductFilters {
  categoryId: string | null;
  minPrice: number;
  maxPrice: number;
  weighted: boolean | null;
}

export interface ProductFilterDialogData {
  categories: ICategory[];

  filters: ProductFilters;

  availableMaxPrice: number;
}

@Component({
  selector: 'app-product-filter-dialog',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatSliderModule,
  ],

  templateUrl:
    './product-filter-dialog.component.html',

  styleUrl:
    './product-filter-dialog.component.scss',
})
export class ProductFilterDialogComponent {

  private dialogRef =
    inject(
      MatDialogRef<
        ProductFilterDialogComponent,
        ProductFilters
      >,
    );

  private fb = inject(FormBuilder);

  data =
    inject<ProductFilterDialogData>(
      MAT_DIALOG_DATA,
    );

  form = this.fb.group({
  categoryId: [
    this.data.filters.categoryId,
  ],

  minPrice: [
    this.data.filters.minPrice ?? 0,
  ],

  maxPrice: [
    this.data.filters.maxPrice ??
      this.data.availableMaxPrice,
  ],

  weighted: [
    this.data.filters.weighted,
  ],
});

  selectCategory(
    categoryId: string | null,
  ) {
    this.form.controls.categoryId
      .setValue(categoryId);
  }

  selectWeighted(
    value: boolean | null,
  ) {
    this.form.controls.weighted
      .setValue(value);
  }

  reset() {
  this.form.patchValue({
    categoryId: null,
    minPrice: 0,
    maxPrice: this.data.availableMaxPrice,
    weighted: null,
  });
}

 apply() {
  const value = this.form.getRawValue();

  this.dialogRef.close({
    categoryId: value.categoryId ?? null,

    minPrice:
      Number(value.minPrice) || 0,

    maxPrice:
      Number(value.maxPrice) ||
      this.data.availableMaxPrice,

    weighted:
      value.weighted ?? null,
  });
}

  close() {
    this.dialogRef.close();
  }
}