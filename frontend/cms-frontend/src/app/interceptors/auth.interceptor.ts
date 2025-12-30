import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  console.log('Auth Interceptor - Token:', token ? 'Present' : 'Missing');
  console.log('Auth Interceptor - URL:', req.url);

  // Clone request and add token if it exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Auth Interceptor - Token added to request');
  } else {
    console.warn('Auth Interceptor - No token found! User may not be logged in.');
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - try to refresh token
      if (error.status === 401 && token) {
        console.log('Auth Interceptor - 401 error, attempting token refresh...');
        return authService.refreshToken().pipe(
          switchMap((tokens) => {
            const newToken = tokens.accessToken;
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            console.log('Auth Interceptor - Token refreshed, retrying request');
            return next(retryReq);
          }),
          catchError((refreshError) => {
            console.log('Auth Interceptor - Token refresh failed, logging out');
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};

