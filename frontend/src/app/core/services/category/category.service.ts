import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import {
  ICategory,
  ICategoryInput,
} from '../../../shared/models/category/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  private API_URL = `${environment.API_URL}/categories`;

  getByStoreId(storeId: string) {
    return this.http.get<ICategory[]>(`${this.API_URL}/by-storeId/${storeId}`);
  }

  getById(id: string) {
    return this.http.get<ICategory>(`${this.API_URL}/by-id/${id}`);
  }

  create(storeId: string, data: ICategoryInput) {
    return this.http.post<ICategory>(`${this.API_URL}/${storeId}`, data);
  }

  update(id: string, data: ICategoryInput) {
    return this.http.put<ICategory>(`${this.API_URL}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<ICategory>(`${this.API_URL}/${id}`);
  }
}
