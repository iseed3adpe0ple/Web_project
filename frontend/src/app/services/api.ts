import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../models/user';
import { Group, Event, Invitation } from '../models/group';
@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // AUTH
  login(data: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.base}/auth/login/`, data).pipe(
      tap(tokens => {
        localStorage.setItem('access', tokens.access);
        localStorage.setItem('refresh', tokens.refresh);
      })
    );
  }createGroup(data: { name: string; description: string }): Observable<Group> {
    return this.http.post<Group>(`${this.base}/groups/`, data);
  }acceptInvitation(id: number): Observable<any> {
    return this.http.post(`${this.base}/auth/invitations/${id}/accept/`, {});
  }

  declineInvitation(id: number): Observable<any> {
    return this.http.post(`${this.base}/auth/invitations/${id}/decline/`, {});
  }
  joinGroup(code: string): Observable<Group> {
    return this.http.post<Group>(`${this.base}/groups/join/`, { code });
  }
  joinGroupById(id: number): Observable<Group> {
    return this.http.post<Group>(`${this.base}/groups/${id}/join/`, {});
  }
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.base}/groups/`);
  }
  getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.base}/groups/${id}/`);
  }getGroupEvents(groupId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.base}/groups/${groupId}/events/`);
  }
  getInvitations(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.base}/auth/invitations/`);
  }getProfile(): Observable<any> {
    return this.http.get(`${this.base}/auth/profile/`);
  }updateProfile(data: { username: string; email: string }): Observable<any> {
    return this.http.put(`${this.base}/auth/profile/`, data);
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
  }createEvent(groupId: number, data: {
    title: string;
    description: string;
    location: string;
    event_type: string;
    start_time: string;
    end_time: string;
  }): Observable<Event> {
    return this.http.post<Event>(`${this.base}/groups/${groupId}/events/`, data);
  }rsvpEvent(groupId: number, eventId: number, status: string): Observable<any> {
    return this.http.post(`${this.base}/groups/${groupId}/events/${eventId}/rsvp/`, { status });
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
