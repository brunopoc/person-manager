import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should handle 400 error', () => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error: Error) => {
        expect(error.message).toBe('Dados inválidos. Verifique as informações e tente novamente.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 404 error', () => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error: Error) => {
        expect(error.message).toBe('Recurso não encontrado.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 409 error', () => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with 409 error'),
      error: (error: Error) => {
        expect(error.message).toBe('CPF já está cadastrado no sistema.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Conflict', { status: 409, statusText: 'Conflict' });
  });

  it('should handle 422 error', () => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with 422 error'),
      error: (error: Error) => {
        expect(error.message).toBe('Dados fornecidos são inválidos.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Unprocessable Entity', { status: 422, statusText: 'Unprocessable Entity' });
  });

  it('should handle 500 error', () => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: Error) => {
        expect(error.message).toBe('Erro interno do servidor. Tente novamente mais tarde.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle unknown error', () => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with unknown error'),
      error: (error: Error) => {
        expect(error.message).toContain('Erro 418:');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('I am a teapot', { status: 418, statusText: 'I am a teapot' });
  });

  it('should handle client-side error', () => {
    const testUrl = '/test';
    const clientError = new ErrorEvent('Network error', {
      message: 'Connection failed'
    });
    
    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with client error'),
      error: (error: Error) => {
        expect(error.message).toBe('Erro: Connection failed');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.error(clientError);
  });

  it('should pass through successful requests', () => {
    const testUrl = '/test';
    const testData = { message: 'success' };
    
    httpClient.get(testUrl).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush(testData);
  });
});