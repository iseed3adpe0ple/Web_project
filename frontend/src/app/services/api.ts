import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../models/user';
import { Group, Event, Invitation } from '../models/group';
import { Poll, PollOption, PollResults } from '../models/poll';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // AUTH
  login(data: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.base}/auth/login/`, data).pipe(
      tap(tokens => {
        setStorageItem('access', tokens.access);
        setStorageItem('refresh', tokens.refresh);
      })
    );
  }createGroup(data: { name: string; description: string }): Observable<Group> {
    return this.http.post<Group>(`${this.base}/groups/`, data);
  }acceptInvitation(id: number): Observable<any> {
    return this.http.post(`${this.base}/invitations/${id}/accept/`, {});
  }

  declineInvitation(id: number): Observable<any> {
    return this.http.post(`${this.base}/invitations/${id}/decline/`, {});
  }
  joinGroup(code: string): Observable<Group> {
    return this.http.post<Group>(`${this.base}/groups/join/`, { invite_code: code });
  }
  inviteUser(groupId: number, username: string): Observable<Invitation> {
    return this.http.post<Invitation>(`${this.base}/groups/${groupId}/invite/`, { username });
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
    return this.http.get<Invitation[]>(`${this.base}/invitations/`);
  }getProfile(): Observable<any> {
    return this.http.get(`${this.base}/profile/`);
  }updateProfile(data: { username: string; email: string }): Observable<any> {
    return this.http.put(`${this.base}/profile/`, data);
  }
  register(data: RegisterRequest): Observable<{user: User; access: string; refresh: string}> {
    return this.http.post<{user: User; access: string; refresh: string}>(
      `${this.base}/auth/register/`, data
    ).pipe(
      tap(res => {
        setStorageItem('access', res.access);
        setStorageItem('refresh', res.refresh);
      })
    );
  }

  logout(): Observable<any> {
    const refresh = getStorageItem('refresh');
    return this.http.post(`${this.base}/auth/logout/`, { refresh }).pipe(
      tap(() => {
        removeStorageItem('access');
        removeStorageItem('refresh');
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
    const refresh = getStorageItem('refresh');
    return this.http.post<{ access: string }>(`${this.base}/auth/token/refresh/`, { refresh }).pipe(
      tap(res => setStorageItem('access', res.access))
    );
  }

  getPolls(groupId: number): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.base}/groups/${groupId}/polls/`);
  }

  createPoll(groupId: number, data: {
    title: string;
    description: string;
    deadline: string;
    options: { datetime: string }[];
  }): Observable<Poll> {
    return this.http.post<Poll>(`${this.base}/groups/${groupId}/polls/`, data);
  }

  deletePoll(groupId: number, pollId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/groups/${groupId}/polls/${pollId}/`);
  }

  vote(groupId: number, pollId: number, optionId: number, action: 'vote' | 'unvote'): Observable<PollOption> {
    return this.http.post<PollOption>(
      `${this.base}/groups/${groupId}/polls/${pollId}/vote/`,
      { option_id: optionId, action }
    );
  }

  getPollResults(groupId: number, pollId: number): Observable<PollResults> {
    return this.http.get<PollResults>(`${this.base}/groups/${groupId}/polls/${pollId}/results/`);
  }

  isLoggedIn(): boolean {
    return !!getStorageItem('access');
  }
}
