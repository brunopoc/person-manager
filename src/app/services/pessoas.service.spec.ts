import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PessoasService } from './pessoas.service';
import { Pessoa } from '../models/pessoa.model';

describe('PessoasService', () => {
  let service: PessoasService;
  let httpMock: HttpTestingController;

  const mockPessoa: Pessoa = {
    id: 1,
    nome: 'João Silva',
    cpf: '12345678901',
    sexo: 'M',
    email: 'joao@email.com',
    telefone: '11999999999'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PessoasService]
    });
    
    service = TestBed.inject(PessoasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPessoas', () => {
    it('should return pessoas array', () => {
      const mockPessoas: Pessoa[] = [mockPessoa];

      service.getPessoas().subscribe(pessoas => {
        expect(pessoas).toEqual(mockPessoas);
        expect(pessoas.length).toBe(1);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/pessoas');
      expect(req.request.method).toBe('GET');
      req.flush(mockPessoas);
    });

    it('should handle error and return empty array', () => {
      service.getPessoas().subscribe(pessoas => {
        expect(pessoas).toEqual([]);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/pessoas');
      req.error(new ProgressEvent('error'));
    });
  });

  describe('getPessoa', () => {
    it('should return a specific pessoa by id', () => {
      const id = 1;

      service.getPessoa(id).subscribe(pessoa => {
        expect(pessoa).toEqual(mockPessoa);
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPessoa);
    });

    it('should handle error when pessoa not found', () => {
      const id = 999;

      service.getPessoa(id).subscribe(pessoa => {
        expect(pessoa).toBeUndefined();
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas/${id}`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('getPessoaByCpf', () => {
    it('should return pessoa when found by CPF', () => {
      const cpf = '12345678901';
      const mockResponse = [mockPessoa];

      service.getPessoaByCpf(cpf).subscribe(pessoa => {
        expect(pessoa).toEqual(mockPessoa);
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas?cpf=${cpf}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return undefined when CPF not found', () => {
      const cpf = '99999999999';
      const mockResponse: Pessoa[] = [];

      service.getPessoaByCpf(cpf).subscribe(pessoa => {
        expect(pessoa).toBeUndefined();
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas?cpf=${cpf}`);
      req.flush(mockResponse);
    });

    it('should remove formatting from CPF before search', () => {
      const cpfFormatted = '123.456.789-01';
      const cpfNumeric = '12345678901';
      const mockResponse = [mockPessoa];

      service.getPessoaByCpf(cpfFormatted).subscribe();

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas?cpf=${cpfNumeric}`);
      req.flush(mockResponse);
    });

    it('should handle error during CPF search', () => {
      const cpf = '12345678901';

      service.getPessoaByCpf(cpf).subscribe(pessoa => {
        expect(pessoa).toBeUndefined();
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas?cpf=${cpf}`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('addPessoa', () => {
    it('should add a new pessoa', () => {
      const newPessoa: Pessoa = {
        nome: 'Maria Santos',
        cpf: '98765432100',
        sexo: 'F',
        email: 'maria@email.com',
        telefone: '11888888888'
      };

      const responseWithId: Pessoa = { ...newPessoa, id: 2 };

      service.addPessoa(newPessoa).subscribe(pessoa => {
        expect(pessoa).toEqual(responseWithId);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/pessoas');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPessoa);
      req.flush(responseWithId);
    });

    it('should handle error when adding pessoa', () => {
      const newPessoa: Pessoa = {
        nome: 'Test',
        cpf: '12345678901',
        sexo: 'M',
        email: 'test@email.com',
        telefone: '11999999999'
      };

      service.addPessoa(newPessoa).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('http://localhost:3000/api/pessoas');
      req.error(new ProgressEvent('error'));
    });
  });

  describe('updatePessoa', () => {
    it('should update an existing pessoa', () => {
      const updatedPessoa: Pessoa = { ...mockPessoa, nome: 'João Silva Updated' };

      service.updatePessoa(updatedPessoa).subscribe(response => {
        expect(response).toEqual(updatedPessoa);
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas/${updatedPessoa.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPessoa);
      req.flush(updatedPessoa);
    });

    it('should handle error when updating pessoa', () => {
      service.updatePessoa(mockPessoa).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas/${mockPessoa.id}`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('deletePessoa', () => {
    it('should delete a pessoa by id', () => {
      const id = 1;

      service.deletePessoa(id).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting pessoa', () => {
      const id = 1;

      service.deletePessoa(id).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/pessoas/${id}`);
      req.error(new ProgressEvent('error'));
    });
  });
});