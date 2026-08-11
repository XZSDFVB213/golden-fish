import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
})
export class SupportComponent {
  // Потом просто подставишь реальные контакты
  productsPhone = '+7 (928) 536-00-09';
  productsEmail = 'amirseidova@bk.ru';

  technicalEmail = 'abakarmadatov2@gmail.com';
  technicalTelegram = '@ngdrx';
}