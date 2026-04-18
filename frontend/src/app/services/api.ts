import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // AUTH
  login(data: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.base}/auth/login/`, data).pipe(
      tap(tokens => {
        localStorage.setItem('access', tokens.access);
        localStorage.setItem('refresh', tokens.refresh);
      })
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.base}/auth/register/`, data);
  }

  logout(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    return this.http.post(`${this.base}/auth/logout/`, { refresh }).pipe(
      tap(() => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      })
    );
  }

  refreshToken(): Observable<{ access: string }> {
    const refresh = localStorage.getItem('refresh');
    return this.http.post<{ access: string }>(`${this.base}/auth/token/refresh/`, { refresh }).pipe(
      tap(res => localStorage.setItem('access', res.access))
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }
}
