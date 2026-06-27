import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../core/environments/environment';

import {
  IStore,
  IStoreCreate,
} from '../../../shared/models/store/store.interface';

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

  getById(storeId: string) {
    return this.http.get<IStore>(`${this.API_URL}/by-id/${storeId}`);
  }

  create(data: IStoreCreate) {
    return this.http.post<IStore>(this.API_URL, data);
  }

  update(storeId: string, data: Partial<IStore>) {
    return this.http.put<IStore>(`${this.API_URL}/${storeId}`, data);
  }

  delete(storeId: string) {
    return this.http.delete<IStore>(`${this.API_URL}/${storeId}`);
  }
}
