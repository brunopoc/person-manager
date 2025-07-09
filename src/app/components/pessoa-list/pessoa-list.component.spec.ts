import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PessoaListComponent } from './pessoa-list.component';
import { PessoaCardComponent } from '../pessoa-card/pessoa-card.component';
import { Pessoa } from '../../models/pessoa.model';

describe('PessoaListComponent', () => {
  let component: PessoaListComponent;
  let fixture: ComponentFixture<PessoaListComponent>;

  const mockPessoas: Pessoa[] = [
    {
      id: 1,
      nome: 'João Silva',
      cpf: '12345678901',
      sexo: 'M',
      email: 'joao@email.com',
      telefone: '11999999999'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      cpf: '98765432100',
      sexo: 'F',
      email: 'maria@email.com',
      telefone: '11888888888'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaListComponent, PessoaCardComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaListComponent);
    component = fixture.componentInstance;
    component.pessoas = mockPessoas;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading state', () => {
    component.isLoading = true;
    component.pessoas = [];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-container')).toBeTruthy();
    expect(compiled.textContent).toContain('Carregando pessoas...');
  });

  it('should display no results message when no pessoas', () => {
    component.pessoas = [];
    component.isLoading = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Nenhuma pessoa encontrada');
  });

  it('should display pessoas cards', () => {
    component.isLoading = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('app-pessoa-card');
    expect(cards.length).toBe(2);
  });

  it('should emit editPessoa event when card emits edit', () => {
    jest.spyOn(component.editPessoa, 'emit');
    
    component.onEditPessoa(mockPessoas[0]);
    
    expect(component.editPessoa.emit).toHaveBeenCalledWith(mockPessoas[0]);
  });

  it('should emit deletePessoa event when card emits delete', () => {
    jest.spyOn(component.deletePessoa, 'emit');
    
    component.onDeletePessoa(mockPessoas[0]);
    
    expect(component.deletePessoa.emit).toHaveBeenCalledWith(mockPessoas[0]);
  });
  
  it('should track pessoas by id', () => {
    const pessoa = mockPessoas[0];
    const trackResult = component.trackByPessoa(0, pessoa);
    expect(trackResult).toBe(pessoa.id);
  });

  it('should track pessoas by index when no id', () => {
    const pessoaWithoutId = { ...mockPessoas[0] };
    delete pessoaWithoutId.id;
    
    const trackResult = component.trackByPessoa(0, pessoaWithoutId);
    expect(trackResult).toBe(0);
  });
});