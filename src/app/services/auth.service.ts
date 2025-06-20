import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { 
  User, 
  UserAuthenticateRequest, 
  UserAuthenticateResponse 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  public currentUser$: Observable<User | null>;
  public isAuthenticated$: Observable<boolean>;

  constructor(private apiService: ApiService) {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('currentUser');
    
    let currentUser: User | null = null;
    if (userData) {
      try {
        currentUser = JSON.parse(userData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!token && !!currentUser);

    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticatedValue(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(credentials: UserAuthenticateRequest): Observable<UserAuthenticateResponse> {
    return this.apiService.post<UserAuthenticateResponse>('Users/Authenticate', credentials)
      .pipe(
        tap((response: UserAuthenticateResponse) => {
          if (response && response.Token) {
            this.setCurrentUser(response.User, response.Token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private setCurrentUser(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  refreshAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } catch (error) {
          this.logout();
        }
      }
    } else {
      this.logout();
    }
  }
} 