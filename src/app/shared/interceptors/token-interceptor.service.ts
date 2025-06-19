import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    
    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    } else if (isApiUrl && 
      !request.url.endsWith("api/Users/authenticate") && 
      !request.url.endsWith("api/Users/login") &&
      !request.url.endsWith("api/Projects") &&
      !request.url.includes("api/Projects/")&& !request.url.includes("api/Curriculum") && !request.url.includes("api/Contact")) {

      if (this.authService.isTokenExpired()) {
        this.router.navigate(["/"]);
      }
    }
    
    return next.handle(request);
  }
} 