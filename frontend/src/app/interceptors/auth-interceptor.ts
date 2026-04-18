import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { ApiService } from '../services/api';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const api = inject(ApiService);
  const router = inject(Router);

  const access = localStorage.getItem('access');

  const authReq = access
    ? req.clone({ setHeaders: { Authorization: `Bearer ${access}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Если 401 — пробуем refresh
      if (error.status === 401 && localStorage.getItem('refresh')) {
        return api.refreshToken().pipe(
          switchMap(res => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access}` }
            });
            return next(retryReq);
          }),
          catchError(() => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
