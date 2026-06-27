import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { IUser } from '../../../shared/models/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private API_URL = `${environment.API_URL}/users`;

  getProfile() {
    return this.http.get<IUser>(
      `${this.API_URL}/profile`,
    );
  }

  toggleFavorite(productId: string) {
    return this.http.patch<boolean>(
      `${this.API_URL}/profile/favorites/${productId}`,
      {},
    );
  }
}