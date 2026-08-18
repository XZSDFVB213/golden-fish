import { Component, computed, input } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ICategory } from '../../models/category/category.interface';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  category = input.required<ICategory>();
  index = input(0);

 image = computed(() => {
  const title = this.category().title
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
});

  onClick() {}
}
