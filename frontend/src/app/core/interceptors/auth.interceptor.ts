import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AuthService } from '../services/auth/auth.service';
import { environment } from '../environments/environment';

let isRefreshing = false;

const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  let authReq = req;

  if (accessToken && req.url.startsWith(environment.API_URL)) {
    authReq = addTokenHeader(req, accessToken);
  }

  if (req.url.startsWith(environment.API_URL)) {
    authReq = authReq.clone({
      withCredentials: true,
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !req.url.includes('/auth/login/access-token')
      ) {
        return handle401Error(authReq, next, authService, router);
      }

      return throwError(() => error);
    }),
  );
};

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
) {
  if (!isRefreshing) {
    isRefreshing = true;

    refreshTokenSubject.next(null);

    return authService.refreshTokens().pipe(
      switchMap((response) => {
        isRefreshing = false;

        localStorage.setItem('accessToken', response.accessToken);

        refreshTokenSubject.next(response.accessToken);

        return next(addTokenHeader(request, response.accessToken));
      }),
      catchError((error) => {
        isRefreshing = false;

        localStorage.removeItem('accessToken');

        router.navigate(['/auth']);

        return throwError(() => error);
      }),
    );
  }

  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => {
      return next(addTokenHeader(request, token!));
    }),
  );
}

function addTokenHeader(request: HttpRequest<unknown>, token: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
