import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundComponent } from './not-found.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let mockLocation: any;

  beforeEach(async () => {
    mockLocation = {
      back: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, ErrorMessageComponent, RouterTestingModule],
      providers: [
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should render error message component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-error-message')).toBeTruthy();
  });

  it('should display 404 title and message', () => {
    const compiled = fixture.nativeElement;
    const errorMessage = compiled.querySelector('app-error-message');
    expect(errorMessage).toBeTruthy();
  });
});