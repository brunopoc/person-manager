import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PessoaCardComponent } from './pessoa-card.component';
import { Pessoa } from '../../models/pessoa.model';

describe('PessoaCardComponent', () => {
  let component: PessoaCardComponent;
  let fixture: ComponentFixture<PessoaCardComponent>;

  const mockPessoa: Pessoa = {
    id: 1,
    nome: 'João Silva',
    cpf: '12345678901',
    sexo: 'M',
    email: 'joao@email.com',
    telefone: '11999999999'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaCardComponent);
    component = fixture.componentInstance;
    component.pessoa = mockPessoa;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display pessoa information', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h5').textContent).toContain('João Silva');
    expect(compiled.textContent).toContain('123.456.789-01');
    expect(compiled.textContent).toContain('joao@email.com');
    expect(compiled.textContent).toContain('11999999999');
    expect(compiled.textContent).toContain('Masculino');
  });

  it('should emit editPessoa event when edit button is clicked', () => {
    jest.spyOn(component.editPessoa, 'emit');
    
    component.onEdit();
    
    expect(component.editPessoa.emit).toHaveBeenCalledWith(mockPessoa);
  });

  it('should emit deletePessoa event when delete button is clicked', () => {
    jest.spyOn(component.deletePessoa, 'emit');
    
    component.onDelete();
    
    expect(component.deletePessoa.emit).toHaveBeenCalledWith(mockPessoa);
  });

  it('should format CPF correctly', () => {
    expect(component.formatCpf('12345678901')).toBe('123.456.789-01');
    expect(component.formatCpf('123.456.789-01')).toBe('123.456.789-01');
  });

  it('should return correct sexo label', () => {
    expect(component.getSexoLabel('M')).toBe('Masculino');
    expect(component.getSexoLabel('F')).toBe('Feminino');
    expect(component.getSexoLabel('Outro')).toBe('Outro');
  });

  it('should display female pessoa correctly', () => {
    const femalePessoa: Pessoa = {
      ...mockPessoa,
      nome: 'Maria Silva',
      sexo: 'F'
    };
    
    component.pessoa = femalePessoa;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h5').textContent).toContain('Maria Silva');
    expect(compiled.textContent).toContain('Feminino');
  });

  it('should display outro sexo correctly', () => {
    const outroPessoa: Pessoa = {
      ...mockPessoa,
      nome: 'Alex Silva',
      sexo: 'Outro'
    };
    
    component.pessoa = outroPessoa;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h5').textContent).toContain('Alex Silva');
    expect(compiled.textContent).toContain('Outro');
  });
});