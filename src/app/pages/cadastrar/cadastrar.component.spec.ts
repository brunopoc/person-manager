import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarComponent } from './cadastrar.component';
import { PessoaFormComponent } from '../../components/pessoa-form/pessoa-form.component';
import { PessoasService } from '../../services/pessoas.service';
import { NotificationService } from '../../services/notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CadastrarComponent', () => {
  let component: CadastrarComponent;
  let fixture: ComponentFixture<CadastrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarComponent, PessoaFormComponent, HttpClientTestingModule],
      providers: [PessoasService, NotificationService]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render pessoa form component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-pessoa-form')).toBeTruthy();
  });
});