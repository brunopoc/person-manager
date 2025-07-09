import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarComponent } from './buscar.component';
import { PessoaSearchComponent } from '../../components/pessoa-search/pessoa-search.component';
import { PessoasService } from '../../services/pessoas.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BuscarComponent', () => {
  let component: BuscarComponent;
  let fixture: ComponentFixture<BuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarComponent, PessoaSearchComponent, HttpClientTestingModule],
      providers: [PessoasService]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render pessoa search component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-pessoa-search')).toBeTruthy();
  });
});