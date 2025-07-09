import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Pessoa } from '@models/pessoa.model';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  private readonly API_URL = 'http://localhost:3000/api/pessoas';

  constructor(private http: HttpClient) {}

  getPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.API_URL)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPessoa(id: number): Observable<Pessoa | undefined> {
    return this.http.get<Pessoa>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPessoaByCpf(cpf: string): Observable<Pessoa | undefined> {
    const cleanCpf = cpf.replace(/\D/g, '');
    return this.http.get<Pessoa[]>(`${this.API_URL}?cpf=${cleanCpf}`)
      .pipe(
        map(pessoas => pessoas.find(p => p.cpf.replace(/\D/g, '') === cleanCpf)),
        catchError(this.handleError)
      );
  }

  addPessoa(pessoa: Pessoa): Observable<Pessoa> {
    const pessoaData = {
      ...pessoa,
      cpf: pessoa.cpf.replace(/\D/g, ''),
      telefone: pessoa.telefone.replace(/\D/g, '')
    };

    return this.http.post<Pessoa>(this.API_URL, pessoaData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePessoa(pessoa: Pessoa): Observable<Pessoa> {
    const pessoaData = {
      ...pessoa,
      cpf: pessoa.cpf.replace(/\D/g, ''),
      telefone: pessoa.telefone.replace(/\D/g, '')
    };

    return this.http.put<Pessoa>(`${this.API_URL}/${pessoa.id}`, pessoaData)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
          break;
        case 400:
          errorMessage = 'Dados inválidos enviados ao servidor.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor.';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    console.error('Erro na requisição:', error);
    return throwError(() => new Error(errorMessage));
  }
}