import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { compileInjectable } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated: boolean) => {
        if (isAuthenticated && !this.authService.isTokenExpired()) {
          return true;
        } else {
          // Redirecionar para home se não estiver autenticado
          console.log('Não está autenticado');
         
          return this.router.createUrlTree(['/home']);
        }
      })
    );
  }
} 