import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  IAuthForm,
  IAuthResponse,
} from '../../../shared/models/user/auth.interface';
import { tap } from 'rxjs';
import { IUser } from '../../../shared/models/user/user.interface';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private env = environment;

  private _user = signal<IUser | null>(this.getStoredUser());
  private _role = signal<'ADMIN' | 'MANAGER' | 'COURIER' | 'BUYER' | null>(
    null,
  );

  role = this._role.asReadonly();

  user = this._user.asReadonly();

  setUser(user: IUser) {
    this._user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this._user.set(null);
    localStorage.removeItem('user');
  }

  private API_URL = `${this.env.API_URL}/auth`;

  main(type: 'login' | 'register', data: IAuthForm) {
    return this.http
      .post<IAuthResponse>(`${this.API_URL}/${type}`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);

          this.setUser(res.user);
          this.setRoleFromToken(res.accessToken);
        }),
      );
  }
  refreshTokens() {
    return this.http.post<IAuthResponse>(
      `${this.API_URL}/login/access-token`,
      {},
      {
        withCredentials: true,
      },
    );
  }
  logout() {
    return this.http
      .post(
        `${this.API_URL}/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap(() => {
          localStorage.removeItem('accessToken');

          this.clearUser();
        }),
      );
  }
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }
  googleLogin() {
    window.location.href = `${environment.API_URL}/auth/google`;
  }

  yandexLogin() {
    window.location.href = `${environment.API_URL}/auth/yandex`;
  }
  private getStoredUser(): IUser | null {
    const user = localStorage.getItem('user');

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  getProfile() {
    return this.http.get<IUser>(`${environment.API_URL}/users/profile`, {
      withCredentials: true,
    });
  }
  setRoleFromToken(token: string) {
const decoded = jwtDecode<JwtPayload>(token);
    this._role.set(decoded.role);
  }
}
