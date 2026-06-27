import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../core/environments/environment';

import {
  IReview,
  IReviewInput,
} from '../../../shared/models/review/review.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);

  private API_URL = `${environment.API_URL}/reviews`;

  getByStoreId(storeId: string) {
    return this.http.get<IReview[]>(
      `${this.API_URL}/by-store/${storeId}`,
    );
  }

  create(
    productId: string,
    storeId: string,
    data: IReviewInput,
  ) {
    return this.http.post<IReview>(
      `${this.API_URL}/${productId}/${storeId}`,
      data,
    );
  }

  delete(id: string) {
    return this.http.delete<IReview>(
      `${this.API_URL}/${id}`,
    );
  }
}