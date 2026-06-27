import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  IAuthForm,
  IAuthResponse,
} from '../../../shared/models/user/auth.interface';
import { tap } from 'rxjs';
import { IUser } from '../../../shared/models/user/user.interface';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  role?: 'ADMIN' | 'MANAGER' | 'COURIER' | 'BUYER';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private env = environment;

  private _user = signal<IUser | null>(this.getStoredUser());
  private _role = signal<'ADMIN' | 'MANAGER' | 'COURIER' | 'BUYER' | null>(null);

  // Readonly сигналы для использования в компонентах
  role = this._role.asReadonly();
  user = this._user.asReadonly();

  private API_URL = `${this.env.API_URL}/auth`;

  constructor() {
    this.initAuthState();
  }

  private initAuthState() {
    const token = this.getAccessToken();
    if (token) {
      this.setRoleFromToken(token);
    }
  }

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
    return this.http
      .post<IAuthResponse>(
        `${this.API_URL}/login/access-token`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);
          if (res.user) {
            this.setUser(res.user);
          }
          this.setRoleFromToken(res.accessToken);
        })
      );
  }

  logout() {
    return this.http
      .post(
        `${this.API_URL}/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.clearAll();
        })
      );
  }

  // ====================== User & Role ======================
  setUser(user: IUser) {
    this._user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this._user.set(null);
    localStorage.removeItem('user');
  }

  private clearAll() {
    localStorage.removeItem('accessToken');
    this.clearUser();
    this._role.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getStoredUser(): IUser | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private setRoleFromToken(token: string) {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this._role.set(decoded.role ?? null);
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      this._role.set(null);
    }
  }

  // ====================== OAuth ======================
  googleLogin() {
    window.location.href = `${this.env.API_URL}/auth/google`;
  }

  yandexLogin() {
    window.location.href = `${this.env.API_URL}/auth/yandex`;
  }

  // ====================== Profile ======================
  getProfile() {
    return this.http.get<IUser>(`${this.env.API_URL}/users/profile`, {
      withCredentials: true,
    }).pipe(
      tap(user => this.setUser(user))
    );
  }
}