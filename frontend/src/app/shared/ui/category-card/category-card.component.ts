import { Component, computed, input, Input, output } from '@angular/core';
import { ICategory } from '../../models/category/category.interface';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [MatButton, MatIconModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  @Input() category!: ICategory;
  clicked = output<ICategory>();
  onClick() {
    this.clicked.emit(this.category);
  }
  index = input(0);

  variant = computed(() => {
    return `variant-${(this.index() % 5) + 1}`;
  });

  icon = computed(() => {
    const title = this.category.title.toLowerCase();

    if (title.includes('мол') || title.includes('сыр')) {
      return 'local_drink';
    }

    if (title.includes('хлеб') || title.includes('выпеч')) {
      return 'bakery_dining';
    }

    if (title.includes('овощ') || title.includes('фрукт')) {
      return 'nutrition';
    }

    if (title.includes('напит') || title.includes('вода')) {
      return 'local_cafe';
    }

    if (title.includes('мяс') || title.includes('колбас')) {
      return 'restaurant';
    }

    if (title.includes('слад') || title.includes('десерт')) {
      return 'cake';
    }

    return 'shopping_basket';
  });
}
