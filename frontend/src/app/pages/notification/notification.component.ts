import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface NotificationItem {
  id: number;
  title: string;
  text: string;
  date: string;
  icon: string;
  type: 'order' | 'promo' | 'info';
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationsComponent {
  filter = signal<'all' | 'unread'>('all');

  notifications = signal<NotificationItem[]>([
    {
      id: 1,
      title: 'Заказ принят',
      text: 'Ваш заказ успешно оформлен и передан магазину.',
      date: 'Сегодня, 12:40',
      icon: 'shopping_bag',
      type: 'order',
      read: false,
    },
    {
      id: 2,
      title: 'Заказ готовится',
      text: 'Мы уже начали собирать ваш заказ.',
      date: 'Сегодня, 12:46',
      icon: 'restaurant',
      type: 'order',
      read: false,
    },
    {
      id: 3,
      title: 'Скидка 20%',
      text: 'Только 3 дня — скидка на выбранные морепродукты.',
      date: 'Вчера, 18:20',
      icon: 'local_offer',
      type: 'promo',
      read: true,
    },
    {
      id: 4,
      title: 'Добро пожаловать!',
      text: 'Спасибо, что выбрали «Золотую рыбку».',
      date: '8 октября',
      icon: 'notifications',
      type: 'info',
      read: true,
    },
  ]);

  filteredNotifications = computed(() => {
    const items = this.notifications();

    if (this.filter() === 'unread') {
      return items.filter(item => !item.read);
    }

    return items;
  });

  unreadCount = computed(
    () => this.notifications()
      .filter(item => !item.read)
      .length,
  );

  setFilter(filter: 'all' | 'unread') {
    this.filter.set(filter);
  }

  markAsRead(id: number) {
    this.notifications.update(items =>
      items.map(item =>
        item.id === id
          ? { ...item, read: true }
          : item,
      ),
    );
  }

  markAllAsRead() {
    this.notifications.update(items =>
      items.map(item => ({
        ...item,
        read: true,
      })),
    );
  }
}