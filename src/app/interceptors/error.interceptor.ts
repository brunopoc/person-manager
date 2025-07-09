import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      timeout(30000),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro na requisição:', error);
        
        let errorMessage = 'Erro desconhecido';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status === 0) {
          errorMessage = 'Erro de conexão com o servidor. Verifique se o servidor está rodando.';
        } else {
          switch (error.status) {
            case 400:
              errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
              break;
            case 404:
              errorMessage = 'Recurso não encontrado.';
              break;
            case 409:
              errorMessage = 'CPF já está cadastrado no sistema.';
              break;
            case 422:
              errorMessage = 'Dados fornecidos são inválidos.';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
              break;
            default:
              errorMessage = `Erro ${error.status}: ${error.error?.message || error.message}`;
          }
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}