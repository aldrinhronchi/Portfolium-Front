import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, catchError, throwError } from "rxjs";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { AuthService } from "../services/auth.service";
import { ErrorInfo } from "src/app/models/error-info.model";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService implements HttpInterceptor {
  private errors = new Subject<string[]>();

  constructor(private router: Router, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let info = this.handleError(error);
        return throwError(info);
      }),
    );
  }

  private handleError = (error: HttpErrorResponse): ErrorInfo => {
    let Icon: SweetAlertIcon = "info";
    let Titulo: String = "Houve um erro!";

    switch (error.status) {
      case 400:
        Icon = "warning";
        Titulo = "Dados inválidos";
        break;
      case 401:
        this.authService.logout();
        this.router.navigate(["/"]);
        return this.createErrorInfo("Sessão expirada", "Sua sessão expirou. Faça login novamente.");
        break;
      case 403:
        Icon = "error";
        Titulo = "Acesso negado";
        break;
      case 404:
        return this.handleNotFound(error);
        break;
      case 500:
        Icon = "error";
        Titulo = "Erro interno do servidor";
        break;
      default:
        Icon = "error";
        Titulo = "Erro inesperado";
    }

    let info: ErrorInfo = this.createErrorInfo(
      error.error?.Message || error.message || "Erro desconhecido",
      Titulo.toString()
    );

    Swal.fire({
      title: Titulo.toString(),
      text: info.Message,
      icon: Icon,
      confirmButtonText: 'ENTENDI',

    });

    return info;
  };

  private handleNotFound = (error: HttpErrorResponse): ErrorInfo => {
    this.router.navigate(["/404"]);
    return this.createErrorInfo("Recurso não encontrado", "404 - Not Found");
  };

  private createErrorInfo(message: string, title: string = ""): ErrorInfo {
    return {
      Message: message,
      Title: title,
      StatusCode: 0
    };
  }
} 