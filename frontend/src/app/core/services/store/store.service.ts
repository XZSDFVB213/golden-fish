import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../core/environments/environment';

import {
  IStore,
  IStoreCreate,
} from '../../../shared/models/store/store.interface';
import { IProduct, IProductInput } from '../../../shared/models/product/product.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private http = inject(HttpClient);

  private API_URL = `${environment.API_URL}/stores`;
  private currentStore = signal<IStore | null>(null);

  readonly store = this.currentStore.asReadonly();

  setStore(store: IStore) {
    this.currentStore.set(store);
  }
  getAllManager() {
    return this.http.get<IStore[]>(`${this.API_URL}/manager/all`);
  }

  getById(storeId: string) {
    return this.http.get<IStore>(`${this.API_URL}/by-id/${storeId}`);
  }

  create(storeId: string, data: IProductInput) {
    return this.http.post<IProduct>(`${this.API_URL}/${storeId}`, data);
  }

  update(id: string, data: IProductInput) {
    return this.http.put<IProduct>(`${this.API_URL}/${id}`, data);
  }

  delete(storeId: string) {
    return this.http.delete<IStore>(`${this.API_URL}/${storeId}`);
  }
}
