import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;
  let location: any;

  beforeEach(async () => {
    const locationSpy = {
      back: jest.fn(),
      forward: jest.fn(),
      go: jest.fn(),
      getState: jest.fn(),
      isCurrentPathEqualTo: jest.fn(),
      normalize: jest.fn(),
      path: jest.fn(),
      prepareExternalUrl: jest.fn(),
      replaceState: jest.fn(),
      subscribe: jest.fn(),
      onPopState: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
      providers: [
        { provide: Location, useValue: locationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title and message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toBe('Erro');
    expect(compiled.querySelector('p').textContent).toBe('Algo deu errado.');
  });

  it('should display custom title and message', () => {
    component.title = 'Página não encontrada';
    component.message = 'A página que você está procurando não existe.';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toBe('Página não encontrada');
    expect(compiled.querySelector('p').textContent).toBe('A página que você está procurando não existe.');
  });

  it('should show action area when showActions is true', () => {
    const compiled = fixture.nativeElement;
    const actionArea = compiled.querySelector('.error-actions');
    expect(actionArea).toBeTruthy();
  });

  it('should hide action area when showActions is false', () => {
    component.showActions = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const actionArea = compiled.querySelector('.error-actions');
    expect(actionArea).toBeNull();
  });

  it('should provide content projection for actions', () => {
    const compiled = fixture.nativeElement;
    const actionArea = compiled.querySelector('.error-actions');
    expect(actionArea).toBeTruthy();
  });

  it('should show default showActions as true', () => {
    expect(component.showActions).toBe(true);
  });

  it('should have correct CSS classes', () => {
    const compiled = fixture.nativeElement;
    const container = compiled.querySelector('.error-container');
    const content = compiled.querySelector('.error-content');
    
    expect(container).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('should display bootstrap icon', () => {
    const compiled = fixture.nativeElement;
    const iconContainer = compiled.querySelector('.error-icon');
    const icon = compiled.querySelector('.bi-exclamation-triangle-fill');
    
    expect(iconContainer).toBeTruthy();
    expect(icon).toBeTruthy();
  });
});