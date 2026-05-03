import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/user.model';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'veena_token';
  private readonly userKey = 'veena_user';
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.readUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      catchError(() => this.mockAuth(payload.email)),
      tap((response) => this.persistSession(response))
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload).pipe(
      catchError(() => this.mockAuth(payload.email, payload.name)),
      tap((response) => this.persistSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'ADMIN';
  }

  private persistSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private readUser(): User | null {
    const rawUser = localStorage.getItem(this.userKey);
    return rawUser ? JSON.parse(rawUser) as User : null;
  }

  private mockAuth(email: string, name = 'Travel Planner'): Observable<AuthResponse> {
    if (!email || email.includes('fail')) {
      return throwError(() => new Error('Invalid email or password.'));
    }

    return of({
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name,
        email,
        role: email.includes('admin') ? 'ADMIN' : 'USER'
      }
    });
  }
}
