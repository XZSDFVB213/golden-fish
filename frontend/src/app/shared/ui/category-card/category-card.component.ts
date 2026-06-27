import { Component, Input, output } from '@angular/core';
import { ICategory } from '../../models/category/category.interface';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [MatButton],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
@Input() category!: ICategory
clicked = output<ICategory>();
onClick() {
  this.clicked.emit(this.category);
}
}
