import {
  Component,
  computed,
  input,
} from '@angular/core';

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
    const title =
      this.category().title.toLowerCase();

    if (title.includes('рыб')) {
      return 'assets/categories/fish-category.png';
    }

    if (
      title.includes('морепродукт') ||
      title.includes('кревет') ||
      title.includes('кальмар')
    ) {
      return 'assets/categories/seafood.png';
    }

    if (title.includes('икр')) {
      return 'assets/categories/caviar.png';
    }

    if (
      title.includes('кулинар') ||
      title.includes('готов')
    ) {
      return 'assets/categories/cooking.png';
    }

    return 'assets/categories/default.png';
  });

  onClick() {}
}