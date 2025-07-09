import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {
  PopupNotificationComponent,
  NotificationConfig,
} from "./popup-notification.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

describe("PopupNotificationComponent", () => {
  let component: PopupNotificationComponent;
  let fixture: ComponentFixture<PopupNotificationComponent>;
  let mockActiveModal: jest.Mocked<NgbActiveModal>;

  beforeEach(async () => {
    mockActiveModal = {
      close: jest.fn(),
      dismiss: jest.fn(),
    } as unknown as jest.Mocked<NgbActiveModal>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, PopupNotificationComponent],
      providers: [{ provide: NgbActiveModal, useValue: mockActiveModal }],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupNotificationComponent);
    component = fixture.componentInstance;
    component.config = {
      message: "Test message",
      type: "info",
      duration: 0,
      showCloseButton: true,
    };
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default config and set title", () => {
    expect(component.config.message).toBe("Test message");
    expect(component.config.type).toBe("info");
    expect(component.config.duration).toBe(0);
    expect(component.config.showCloseButton).toBe(true);
    expect(component.title).toBe("Informação");
  });

  it("should call activeModal.close after duration", fakeAsync(() => {
    const testDuration = 1000;
    component.config.duration = testDuration;
    component.ngOnInit();

    expect(mockActiveModal.close).not.toHaveBeenCalled();

    tick(testDuration);
    expect(mockActiveModal.close).toHaveBeenCalledWith(
      "closed by timer or button"
    );
  }));

  it("should not call activeModal.close if duration is 0 or not set", fakeAsync(() => {
    component.config.duration = 0;
    component.ngOnInit();
    tick(2000);
    expect(mockActiveModal.close).not.toHaveBeenCalled();

    component.config.duration = undefined;
    component.ngOnInit();
    tick(2000);
    expect(mockActiveModal.close).not.toHaveBeenCalled();
  }));

  it("should call activeModal.dismiss when dismissNotification is called", () => {
    component.dismissNotification();
    expect(mockActiveModal.dismiss).toHaveBeenCalledWith("dismissed by user");
  });

  it("should call activeModal.close when closeNotification is called", () => {
    component.closeNotification();
    expect(mockActiveModal.close).toHaveBeenCalledWith(
      "closed by timer or button"
    );
  });

  it("should get correct title for success type", () => {
    component.config.type = "success";
    expect(component.getTitle()).toBe("Sucesso");
  });

  it("should get correct title for error type", () => {
    component.config.type = "error";
    expect(component.getTitle()).toBe("Erro");
  });

  it("should get correct title for warning type", () => {
    component.config.type = "warning";
    expect(component.getTitle()).toBe("Atenção");
  });

  it("should get correct title for info type", () => {
    component.config.type = "info";
    expect(component.getTitle()).toBe("Informação");
  });

  it("should set custom config and update title on ngOnInit", () => {
    const customConfig: NotificationConfig = {
      message: "Custom message",
      type: "warning",
      duration: 5000,
      showCloseButton: false,
    };

    component.config = customConfig;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.config.message).toBe("Custom message");
    expect(component.config.type).toBe("warning");
    expect(component.config.duration).toBe(5000);
    expect(component.config.showCloseButton).toBe(false);
    expect(component.title).toBe("Atenção");
  });

  it("should clear the timer on ngOnDestroy", fakeAsync(() => {
    const testDuration = 5000;
    component.config.duration = testDuration;
    component.ngOnInit();

    expect(component["timer"]).toBeDefined();

    component.ngOnDestroy();
    tick(testDuration);

    expect(mockActiveModal.close).not.toHaveBeenCalled();
  }));

  it("should display message correctly in the template", () => {
    component.config.message = "Mensagem de teste para o template";
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector(".modal-body p")?.textContent).toContain(
      "Mensagem de teste para o template"
    );
  });

  it("should show close button when showCloseButton is true", () => {
    component.config.showCloseButton = true;
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const closeButton = compiled.querySelector(".btn-close");
    expect(closeButton).toBeTruthy();
  });

  it("should hide close button when showCloseButton is false", () => {
    component.config.showCloseButton = false;
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const closeButton = compiled.querySelector(".btn-close");
    expect(closeButton).toBeFalsy();
  });

  it("should have correct CSS classes for different types in modal-header", () => {
    component.config.type = "success";
    fixture.detectChanges();
    let header = fixture.nativeElement.querySelector(".modal-header");
    expect(header.classList.contains("bg-success")).toBeTruthy();

    component.config.type = "error";
    fixture.detectChanges();
    header = fixture.nativeElement.querySelector(".modal-header");
    expect(header.classList.contains("bg-error")).toBeTruthy();

    component.config.type = "warning";
    fixture.detectChanges();
    header = fixture.nativeElement.querySelector(".modal-header");
    expect(header.classList.contains("bg-warning")).toBeTruthy();

    component.config.type = "info";
    fixture.detectChanges();
    header = fixture.nativeElement.querySelector(".modal-header");
    expect(header.classList.contains("bg-info")).toBeTruthy();
  });
});
