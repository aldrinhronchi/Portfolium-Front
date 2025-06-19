import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { AppConstants } from '../constants/app.constants';
import { RequestViewModel } from 'src/app/models/request.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly TOKEN_KEY = AppConstants.STORAGE_KEYS.TOKEN;
  private readonly USER_KEY = AppConstants.STORAGE_KEYS.USER;
  private readonly API_URL = environment.apiUrl;
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) { }

  /**
   * Login do usuário
   */
  login(email: string, password: string): Observable<RequestViewModel<User>> {
    return this.apiService.post<RequestViewModel<User>>('Users/authenticate', {
      Email: email,
      Password: password
    }).pipe(
      map(response => {
        if (response.Data) {
          const user = response.Data[0];
          this.setSession(user);
        }
        return response;
      })
    );
  }

  /**
   * Logout do usuário
   */
  logout(): void {
    this.removeSession();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    return this.hasValidToken() && !this.isTokenExpired();
  }

  /**
   * Verificar se token está expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Converte para milissegundos
      return Date.now() > expiry;
    } catch (error) {
      return true;
    }
  }

  /**
   * Obter token atual
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Getter para valor atual de autenticação 
   */
  get isAuthenticatedValue(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Getter para valor atual do usuário
   */
  get currentUserValue(): User | null {
    return this.getCurrentUser();
  }

  /**
   * Obter dados do usuário do token
   */
  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  /**
   * Definir sessão de usuário
   */
  private setSession(user: User): void {
    if (user.Token) {
      localStorage.setItem(this.TOKEN_KEY, user.Token);
    }
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Remover sessão de usuário
   */
  private removeSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Verificar se tem token válido
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Obter usuário do storage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        this.removeSession();
        return null;
      }
    }
    return null;
  }

  /**
   * Atualizar informações do usuário
   */
  updateUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Verificar se usuário tem permissão administrativa
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.Role === 'Admin' || false;
  }

  /**
   * Renovar token (implementação futura)
   */
  refreshToken(): Observable<any> {
    // Implementar renovação de token se necessário
    return new Observable(observer => {
      observer.error('Refresh token not implemented');
    });
  }
} 