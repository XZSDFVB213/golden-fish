import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { StoreService } from '../../../core/services/store/store.service';
import { ProductService } from '../../../features/products/service/product.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { OrdersManagerService } from '../orders/service/orders-manager.service';

import { IStore } from '../../../shared/models/store/store.interface';
import { IProduct } from '../../../shared/models/product/product.interface';
import {
  EnumOrderStatus,
  IOrder,
} from '../../../shared/models/order/order.interface';
import { ICategory } from '../../../shared/models/category/category.interface';

interface IStoreCard {
  store: IStore;
  products: number;
  categories: number;
  orders: number;
  activeOrders: number;
  revenue: number;
}

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    DecimalPipe,
  ],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss',
})
export class StoresComponent {
  private storeService = inject(StoreService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private ordersService = inject(OrdersManagerService);

  stores = signal<IStore[]>([]);
  products = signal<IProduct[]>([]);
  orders = signal<IOrder[]>([]);

  categoriesByStore = signal<
    Record<string, ICategory[]>
  >({});

  search = signal('');

  storeCards = computed<IStoreCard[]>(() => {
    return this.stores().map(store => {
      const products = this.products().filter(
        product => product.storeId === store.id,
      );

      const categories =
        this.categoriesByStore()[store.id] ?? [];

      const orders = this.orders().filter(order =>
        order.items.some(
          item => item.storeId === store.id,
        ),
      );

      const activeOrders = orders.filter(order =>
        [
          EnumOrderStatus.PENDING,
          EnumOrderStatus.PAYED,
          EnumOrderStatus.PROCESSING,
          EnumOrderStatus.READY,
          EnumOrderStatus.DELIVERY,
        ].includes(order.status),
      ).length;

      const revenue = orders
        .filter(
          order =>
            order.status ===
            EnumOrderStatus.COMPLETED,
        )
        .reduce((sum, order) => {
          const storeTotal = order.items
            .filter(
              item => item.storeId === store.id,
            )
            .reduce(
              (acc, item) =>
                acc + item.price * item.quantity,
              0,
            );

          return sum + storeTotal;
        }, 0);

      return {
        store,
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        activeOrders,
        revenue,
      };
    });
  });

  filteredStores = computed(() => {
    const search = this.search()
      .trim()
      .toLowerCase();

    if (!search) {
      return this.storeCards();
    }

    return this.storeCards().filter(card => {
      const store = card.store;

      return (
        this.getStoreName(store)
          .toLowerCase()
          .includes(search) ||
        this.getStoreAddress(store)
          .toLowerCase()
          .includes(search)
      );
    });
  });

  totalRevenue = computed(() =>
    this.storeCards().reduce(
      (sum, store) => sum + store.revenue,
      0,
    ),
  );

  totalProducts = computed(() =>
    this.storeCards().reduce(
      (sum, store) => sum + store.products,
      0,
    ),
  );

  constructor() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      stores: this.storeService.getAllManager(),
      products: this.productService.getAll(),
      orders: this.ordersService.getAll(),
    }).subscribe(({ stores, products, orders }) => {
      this.stores.set(stores);
      this.products.set(products);
      this.orders.set(orders);

      this.loadCategories(stores);
    });
  }

  private loadCategories(stores: IStore[]) {
    if (!stores.length) {
      this.categoriesByStore.set({});
      return;
    }

    forkJoin(
      stores.map(store =>
        this.categoryService.getByStoreId(store.id),
      ),
    ).subscribe(result => {
      const categories: Record<
        string,
        ICategory[]
      > = {};

      stores.forEach((store, index) => {
        categories[store.id] = result[index];
      });

      this.categoriesByStore.set(categories);
    });
  }

  getStoreName(store: IStore): string {
    return (
      (store as any).title ||
      (store as any).name ||
      'Золотая рыбка'
    );
  }

  getStoreAddress(store: IStore): string {
    return (
      (store as any).address ||
      'Адрес не указан'
    );
  }
}