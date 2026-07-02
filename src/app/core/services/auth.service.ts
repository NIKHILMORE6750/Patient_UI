import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest, LoginResponse, RegisterRequest, Role
} from '../models/patient.model';

const TOKEN_KEY = 'pms_token';
const ROLE_KEY = 'pms_role';
const EMAIL_KEY = 'pms_email';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = environment.apiBaseUrl;

  readonly isAuthenticated = signal<boolean>(this.hasToken());
  readonly role = signal<Role | null>(
    (localStorage.getItem(ROLE_KEY) as Role) ?? null
  );

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.base}/auth/login`, credentials)
      .pipe(tap((res) => this.store(res)));
  }

  register(req: RegisterRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.base}/auth/register`, req)
      .pipe(tap((res) => this.store(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EMAIL_KEY);
    this.isAuthenticated.set(false);
    this.role.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUserEmail(): string {
    return localStorage.getItem(EMAIL_KEY) ?? '';
  }

  // A friendly display name derived from the email local-part, since the
  // login token carries an email rather than a stored full name.
  // e.g. "patient@test.com" -> "Patient", "john.doe@x.com" -> "John Doe"
  displayName(): string {
    const email = this.getUserEmail();
    if (!email) return '';
    const local = email.split('@')[0];
    return local
      .split(/[._-]+/)
      .filter((p) => p.length > 0)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  isAdmin(): boolean { return this.role() === 'ADMIN'; }
  isDoctor(): boolean { return this.role() === 'DOCTOR'; }
  isPatient(): boolean { return this.role() === 'PATIENT'; }

  private store(res: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(ROLE_KEY, res.role);
    localStorage.setItem(EMAIL_KEY, res.email);
    this.isAuthenticated.set(true);
    this.role.set(res.role);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
