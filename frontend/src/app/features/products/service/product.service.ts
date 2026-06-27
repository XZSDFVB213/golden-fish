import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  IProduct,
  IProductInput,
} from '../../../shared/models/product/product.interface';
import { environment } from '../../../core/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private API_URL = `${environment.API_URL}/products`;

  getAll(searchTerm?: string) {
    let params = new HttpParams();

    if (searchTerm) {
      params = params.set(
        'searchTerm',
        searchTerm,
      );
    }

    return this.http.get<IProduct[]>(
      this.API_URL,
      {
        params,
      },
    );
  }

  getByStoreId(storeId: string) {
    return this.http.get<IProduct[]>(
      `${this.API_URL}/by-storeId/${storeId}`,
    );
  }

  getById(id: string) {
    return this.http.get<IProduct>(
      `${this.API_URL}/by-id/${id}`,
    );
  }

  getByCategory(categoryId: string) {
    return this.http.get<IProduct[]>(
      `${this.API_URL}/by-category/${categoryId}`,
    );
  }

  getMostPopular() {
    return this.http.get<IProduct[]>(
      `${this.API_URL}/most-popular`,
    );
  }

  getSimilar(id: string) {
    return this.http.get<IProduct[]>(
      `${this.API_URL}/similar/${id}`,
    );
  }

  create(
    storeId: string,
    data: IProductInput,
  ) {
    return this.http.post<IProduct>(
      `${this.API_URL}/${storeId}`,
      data,
    );
  }

  update(
    id: string,
    data: IProductInput,
  ) {
    return this.http.put<IProduct>(
      `${this.API_URL}/${id}`,
      data,
    );
  }

  delete(id: string) {
    return this.http.delete<IProduct>(
      `${this.API_URL}/${id}`,
    );
  }
}