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
  imports: [
    RouterLink,
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  category = input.required<ICategory>();

  index = input(0);

  variant = computed(
    () => `variant-${(this.index() % 5) + 1}`,
  );

  onClick() {}
}