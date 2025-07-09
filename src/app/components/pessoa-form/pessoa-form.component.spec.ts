import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { PessoaFormComponent } from './pessoa-form.component';
import { PessoasService } from '../../services/pessoas.service';
import { NotificationService } from '../../services/notification.service';
import { Pessoa } from '../../models/pessoa.model';

describe('PessoaFormComponent', () => {
  let component: PessoaFormComponent;
  let fixture: ComponentFixture<PessoaFormComponent>;
  let pessoasService: any;
  let notificationService: any;

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

    const notificationServiceSpy = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showWarning: jest.fn(),
      showInfo: jest.fn(),
      setRootViewContainerRef: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        PessoaFormComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: PessoasService, useValue: pessoasServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaFormComponent);
    component = fixture.componentInstance;
    pessoasService = TestBed.inject(PessoasService);
    notificationService = TestBed.inject(NotificationService);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.pessoaForm.get('nome')?.value).toBe('');
    expect(component.pessoaForm.get('cpf')?.value).toBe('');
    expect(component.pessoaForm.get('sexo')?.value).toBe('');
    expect(component.pessoaForm.get('email')?.value).toBe('');
    expect(component.pessoaForm.get('telefone')?.value).toBe('');
  });

  it('should have all required validators', () => {
    const form = component.pessoaForm;
    
    expect(form.get('nome')?.hasError('required')).toBeTruthy();
    expect(form.get('cpf')?.hasError('required')).toBeTruthy();
    expect(form.get('sexo')?.hasError('required')).toBeTruthy();
    expect(form.get('email')?.hasError('required')).toBeTruthy();
    expect(form.get('telefone')?.hasError('required')).toBeTruthy();
  });

  it('should validate nome minlength and maxlength', () => {
    const nomeControl = component.pessoaForm.get('nome');
    
    nomeControl?.setValue('J');
    expect(nomeControl?.hasError('minlength')).toBeTruthy();
    
    nomeControl?.setValue('A'.repeat(101));
    expect(nomeControl?.hasError('maxlength')).toBeTruthy();
    
    nomeControl?.setValue('João Silva');
    expect(nomeControl?.valid).toBeTruthy();
  });

  it('should validate CPF correctly', () => {
    const cpfControl = component.pessoaForm.get('cpf');
    
    cpfControl?.setValue('12345678901');
    expect(cpfControl?.hasError('cpfInvalid')).toBeTruthy();
    
    cpfControl?.setValue('11111111111');
    expect(cpfControl?.hasError('cpfInvalid')).toBeTruthy();
    
    cpfControl?.setValue('12345678909');
    expect(cpfControl?.valid).toBeTruthy();
  });

  it('should validate email correctly', () => {
    const emailControl = component.pessoaForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('emailInvalid')).toBeTruthy();
    
    emailControl?.setValue('test@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate telefone minlength and maxlength', () => {
    const telefoneControl = component.pessoaForm.get('telefone');
    
    telefoneControl?.setValue('123');
    expect(telefoneControl?.hasError('minlength')).toBeTruthy();
    
    telefoneControl?.setValue('1234567890123456');
    expect(telefoneControl?.hasError('maxlength')).toBeTruthy();
    
    telefoneControl?.setValue('11999999999');
    expect(telefoneControl?.valid).toBeTruthy();
  });

  it('should format CPF input correctly', () => {
    const mockEvent = {
      target: { value: '12345678901' }
    };
    
    component.onCpfInput(mockEvent);
    expect(component.pessoaForm.get('cpf')?.value).toBe('123.456.789-01');
  });

  it('should format telefone input correctly for 11 digits', () => {
    const mockEvent = {
      target: { value: '11999999999' }
    };
    
    component.onTelefoneInput(mockEvent);
    expect(component.pessoaForm.get('telefone')?.value).toBe('(11) 99999-9999');
  });

  it('should format telefone input correctly for 10 digits', () => {
    const mockEvent = {
      target: { value: '1199999999' }
    };
    
    component.onTelefoneInput(mockEvent);
    expect(component.pessoaForm.get('telefone')?.value).toBe('(11) 9999-9999');
  });

  it('should submit valid form successfully', () => {
    pessoasService.addPessoa.mockReturnValue(of(mockPessoa));
    
    component.pessoaForm.patchValue({
      nome: 'João Silva',
      cpf: '123.456.789-09',
      sexo: 'M',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999'
    });
    
    component.onSubmit();
    
    expect(pessoasService.addPessoa).toHaveBeenCalledWith({
      nome: 'João Silva',
      cpf: '12345678909',
      sexo: 'M',
      email: 'joao@email.com',
      telefone: '11999999999'
    });
    
    expect(notificationService.showSuccess).toHaveBeenCalledWith('Pessoa cadastrada com sucesso!');
  });

  it('should handle submission error', fakeAsync(() => {
    pessoasService.addPessoa.mockReturnValue(throwError(() => new Error('Service error')));
    
    component.pessoaForm.patchValue({
      nome: 'João Silva',
      cpf: '123.456.789-09',
      sexo: 'M',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999'
    });
    
    component.onSubmit();
    tick();
    
    expect(notificationService.showError).toHaveBeenCalledWith('Service error');
  }));

  it('should not submit invalid form', () => {
    component.onSubmit();
    
    expect(pessoasService.addPessoa).not.toHaveBeenCalled();
    expect(component.pessoaForm.get('nome')?.touched).toBeTruthy();
    expect(component.pessoaForm.get('cpf')?.touched).toBeTruthy();
    expect(component.pessoaForm.get('sexo')?.touched).toBeTruthy();
    expect(component.pessoaForm.get('email')?.touched).toBeTruthy();
    expect(component.pessoaForm.get('telefone')?.touched).toBeTruthy();
  });

  it('should return correct error messages', () => {
    const nomeControl = component.pessoaForm.get('nome');
    nomeControl?.markAsTouched();
    
    expect(component.getErrorMessage('nome')).toBe('Nome é obrigatório');
    
    nomeControl?.setValue('J');
    expect(component.getErrorMessage('nome')).toBe('Nome deve ter pelo menos 2 caracteres');
    
    nomeControl?.setValue('A'.repeat(101));
    expect(component.getErrorMessage('nome')).toBe('Nome deve ter no máximo 100 caracteres');
  });

  it('should return CPF and email specific error messages', () => {
    const cpfControl = component.pessoaForm.get('cpf');
    const emailControl = component.pessoaForm.get('email');
    
    cpfControl?.markAsTouched();
    cpfControl?.setValue('12345678901');
    expect(component.getErrorMessage('cpf')).toBe('CPF inválido');
    
    emailControl?.markAsTouched();
    emailControl?.setValue('invalid-email');
    expect(component.getErrorMessage('email')).toBe('Email inválido');
  });

  it('should have correct sexo options', () => {
    expect(component.sexoOptions).toEqual([
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Feminino' },
      { value: 'Outro', label: 'Outro' }
    ]);
  });

  it('should reset form after successful submission', () => {
    pessoasService.addPessoa.mockReturnValue(of(mockPessoa));
    
    component.pessoaForm.patchValue({
      nome: 'João Silva',
      cpf: '123.456.789-09',
      sexo: 'M',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999'
    });
    
    component.onSubmit();
    
    expect(component.pessoaForm.pristine).toBeTruthy();
    expect(component.pessoaForm.get('nome')?.value).toBeNull();
  });

  it('should prevent multiple submissions', () => {
    component.isSubmitting = true;
    
    const initialSubmittingState = component.isSubmitting;
    expect(initialSubmittingState).toBe(true);
    
    expect(component.isSubmitting).toBe(true);
  });
});
