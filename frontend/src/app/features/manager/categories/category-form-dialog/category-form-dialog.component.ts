import {
  Component,
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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ICategory } from '../../../../shared/models/category/category.interface';
import { IStore } from '../../../../shared/models/store/store.interface';

import { CategoryService } from '../../../../core/services/category/category.service';

interface CategoryDialogData {
  category?: ICategory;
  stores: IStore[];
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './category-form-dialog.component.html',
  styleUrl: './category-form-dialog.component.scss',
})
export class CategoryFormDialogComponent {
  private fb = inject(NonNullableFormBuilder);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  private dialogRef =
    inject(MatDialogRef<CategoryFormDialogComponent>);

  data =
    inject<CategoryDialogData>(MAT_DIALOG_DATA);

  loading = signal(false);

  isEdit = !!this.data.category;

  form = this.fb.group({
    title: [
      this.data.category?.title ?? '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],

    description: [
      this.data.category?.description ?? '',
    ],

    storeId: [
      this.data.category?.storeId ??
        this.data.stores[0]?.id ??
        '',
      Validators.required,
    ],
  });

  constructor() {
    if (this.isEdit) {
      this.form.controls.storeId.disable();
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload = {
      title: value.title.trim(),
      description: value.description.trim(),
    };

    this.loading.set(true);

    const request$ = this.data.category
      ? this.categoryService.update(
          this.data.category.id,
          payload,
        )
      : this.categoryService.create(
          value.storeId,
          payload,
        );

    request$.subscribe({
      next: result => {
        this.loading.set(false);

        this.snackBar.open(
          this.isEdit
            ? 'Категория обновлена'
            : 'Категория создана',
          'Закрыть',
          {
            duration: 2500,
          },
        );

        this.dialogRef.close(result);
      },

      error: () => {
        this.loading.set(false);

        this.snackBar.open(
          'Не удалось сохранить категорию',
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