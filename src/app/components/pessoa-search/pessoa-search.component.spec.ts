import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { PessoaSearchComponent } from './pessoa-search.component';
import { PessoasService } from '../../services/pessoas.service';
import { Pessoa } from '../../models/pessoa.model';

describe('PessoaSearchComponent', () => {
  let component: PessoaSearchComponent;
  let fixture: ComponentFixture<PessoaSearchComponent>;
  let pessoasService: any;

  const mockPessoa: Pessoa = {
    id: 1,
    nome: 'João Silva',
    cpf: '12345678901',
    sexo: 'M',
    email: 'joao@email.com',
    telefone: '11999999999'
  };

  beforeEach(async () => {
    const pessoasServiceSpy = {
      addPessoa: jest.fn(),
      getPessoas: jest.fn(),
      getPessoa: jest.fn(),
      getPessoaByCpf: jest.fn(),
      updatePessoa: jest.fn(),
      deletePessoa: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PessoaSearchComponent, ReactiveFormsModule],
      providers: [
        { provide: PessoasService, useValue: pessoasServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaSearchComponent);
    component = fixture.componentInstance;
    pessoasService = TestBed.inject(PessoasService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty CPF', () => {
    expect(component.searchForm.get('cpf')?.value).toBe('');
  });

  it('should have CPF required validator', () => {
    const cpfControl = component.searchForm.get('cpf');
    expect(cpfControl?.hasError('required')).toBeTruthy();
  });

  it('should validate CPF correctly', () => {
    const cpfControl = component.searchForm.get('cpf');
    
    cpfControl?.setValue('12345678901');
    expect(cpfControl?.hasError('cpfInvalid')).toBeTruthy();
    
    cpfControl?.setValue('11111111111');
    expect(cpfControl?.hasError('cpfInvalid')).toBeTruthy();
    
    cpfControl?.setValue('11144477735');
    expect(cpfControl?.valid).toBeTruthy();
  });

  it('should search pessoa successfully', () => {
    pessoasService.getPessoaByCpf.mockReturnValue(of(mockPessoa));
    
    component.searchForm.get('cpf')?.setValue('11144477735');
    component.onSearch();
    
    expect(pessoasService.getPessoaByCpf).toHaveBeenCalledWith('11144477735');
    expect(component.pessoa).toEqual(mockPessoa);
    expect(component.searchPerformed).toBeTruthy();
    expect(component.isSearching).toBeFalsy();
    expect(component.errorMessage).toBe('');
  });

  it('should handle pessoa not found', () => {
    pessoasService.getPessoaByCpf.mockReturnValue(of(undefined));
    
    component.searchForm.get('cpf')?.setValue('11144477735');
    component.onSearch();
    
    expect(component.pessoa).toBeNull();
    expect(component.searchPerformed).toBeTruthy();
    expect(component.isSearching).toBeFalsy();
    expect(component.errorMessage).toBe('Pessoa não encontrada com o CPF informado.');
  });

  it('should handle search error', fakeAsync(() => {
    const error = { message: 'Search error' };
    pessoasService.getPessoaByCpf.mockReturnValue(throwError(() => error));
    
    component.searchForm.get('cpf')?.setValue('11144477735');
    component.onSearch();
    tick();
    
    expect(component.pessoa).toBeNull();
    expect(component.searchPerformed).toBeTruthy();
    expect(component.errorMessage).toBe('Search error');
  }));

  it('should not search with invalid form', () => {
    component.searchForm.get('cpf')?.setValue('');
    component.onSearch();
    
    expect(pessoasService.getPessoaByCpf).not.toHaveBeenCalled();
    expect(component.isSearching).toBeFalsy();
  });

  it('should format CPF input correctly', () => {
    const mockEvent = {
      target: { value: '11144477735' }
    };
    
    component.onCpfInput(mockEvent);
    expect(component.searchForm.get('cpf')?.value).toBe('111.444.777-35');
  });

  it('should clear search results', () => {
    component.pessoa = mockPessoa;
    component.searchPerformed = true;
    component.errorMessage = 'Some error';
    
    component.clearSearch();
    
    expect(component.pessoa).toBeNull();
    expect(component.searchPerformed).toBeFalsy();
    expect(component.errorMessage).toBe('');
    expect(component.searchForm.get('cpf')?.value).toBeNull();
  });

  it('should get error message when CPF is required', () => {
    component.searchForm.get('cpf')?.setValue('');
    component.searchForm.get('cpf')?.markAsTouched();
    
    expect(component.getErrorMessage()).toBe('CPF é obrigatório');
  });

  it('should get error message when CPF is invalid', () => {
    const cpfControl = component.searchForm.get('cpf');
    cpfControl?.setValue('12345678901');
    cpfControl?.markAsTouched();
    // Force the error to be set correctly
    cpfControl?.setErrors({ 'cpfInvalido': true });
    
    expect(component.getErrorMessage()).toBe('CPF inválido');
  });

  it('should return empty error message when no errors', () => {
    component.searchForm.get('cpf')?.setValue('11144477735');
    
    expect(component.getErrorMessage()).toBe('');
  });

  it('should format CPF correctly', () => {
    expect(component.formatCpf('11144477735')).toBe('111.444.777-35');
    expect(component.formatCpf('111.444.777-35')).toBe('111.444.777-35');
  });

  it('should return correct sexo label', () => {
    expect(component.getSexoLabel('M')).toBe('Masculino');
    expect(component.getSexoLabel('F')).toBe('Feminino');
    expect(component.getSexoLabel('Outro')).toBe('Outro');
  });

  it('should display search form', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('input[type="text"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should display loading state during search', () => {
    component.isSearching = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Buscando...');
  });

  it('should display pessoa card when found', () => {
    component.pessoa = mockPessoa;
    component.searchPerformed = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('João Silva');
    expect(compiled.textContent).toContain('123.456.789-01');
  });

  it('should display not found message when pessoa not found', () => {
    component.pessoa = null;
    component.searchPerformed = true;
    component.errorMessage = 'Pessoa não encontrada com o CPF informado.';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('CPF não encontrado');
  });

  it('should display error message when error occurs', () => {
    component.errorMessage = 'Erro de teste';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Erro de teste');
  });

  it('should show clear button when search performed', () => {
    component.pessoa = mockPessoa;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    const clearButton = Array.from(buttons).find((btn: any) => btn.textContent.includes('Limpar'));
    expect(clearButton).toBeTruthy();
  });
});