import { TestBed } from "@angular/core/testing";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NotificationService } from "./notification.service";
import {
  PopupNotificationComponent,
  NotificationConfig,
} from "../components/popup-notification/popup-notification.component";

describe("NotificationService", () => {
  let service: NotificationService;
  let mockNgbModal: jest.Mocked<NgbModal>;

  beforeEach(() => {
    mockNgbModal = {
      open: jest.fn().mockReturnValue({
        componentInstance: {
          config: {} as NotificationConfig,
        } as PopupNotificationComponent,
        result: Promise.resolve("modal closed"),
      } as NgbModalRef),
    } as unknown as jest.Mocked<NgbModal>;

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: NgbModal, useValue: mockNgbModal },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("showNotification", () => {
    it("should call modalService.open with the correct component and options", () => {
      const testConfig: NotificationConfig = {
        message: "Test message",
        type: "info",
        duration: 2000,
        showCloseButton: true,
      };

      service.showNotification(testConfig);

      expect(mockNgbModal.open).toHaveBeenCalledWith(
        PopupNotificationComponent,
        {
          centered: true,
          backdropClass: "custom-notification-backdrop",
          windowClass: "custom-notification-window",
          animation: true,
          scrollable: false,
          keyboard: true,
          backdrop: true,
        }
      );

      testConfig.showCloseButton = false;
      service.showNotification(testConfig);
      expect(mockNgbModal.open).toHaveBeenCalledWith(
        PopupNotificationComponent,
        expect.objectContaining({
          keyboard: false,
        })
      );
    });

    it("should set the config on the component instance", () => {
      const testConfig: NotificationConfig = {
        message: "Instance config",
        type: "success",
        duration: 1000,
        showCloseButton: false,
      };

      const modalRefMock = {
        componentInstance: {
          config: {} as NotificationConfig,
        } as PopupNotificationComponent,
        result: Promise.resolve("closed"),
      };
      mockNgbModal.open.mockReturnValue(modalRefMock as NgbModalRef);

      service.showNotification(testConfig);

      expect(modalRefMock.componentInstance.config).toEqual(testConfig);
    });

    it("should return the modal result promise", async () => {
      const expectedResult = "modal dismissed";
      mockNgbModal.open.mockReturnValue({
        componentInstance: {
          config: {} as NotificationConfig,
        } as PopupNotificationComponent,
        result: Promise.reject(expectedResult),
      } as NgbModalRef);

      const resultPromise = service.showNotification({
        message: "Test",
        type: "info",
      });

      await expect(resultPromise).rejects.toBe(expectedResult);

      const expectedCloseResult = "modal closed";
      mockNgbModal.open.mockReturnValue({
        componentInstance: {
          config: {} as NotificationConfig,
        } as PopupNotificationComponent,
        result: Promise.resolve(expectedCloseResult),
      } as NgbModalRef);

      const closeResultPromise = service.showNotification({
        message: "Test",
        type: "info",
      });
      await expect(closeResultPromise).resolves.toBe(expectedCloseResult);
    });
  });

  describe("shortcut methods", () => {
    it("showSuccess should call showNotification with correct config", () => {
      const message = "Success message";
      const duration = 1500;
      const showClose = false;

      jest.spyOn(service, "showNotification");
      service.showSuccess(message, duration, showClose);

      expect(service.showNotification).toHaveBeenCalledWith({
        message,
        type: "success",
        duration,
        showCloseButton: showClose,
      });
    });

    it("showError should call showNotification with correct config", () => {
      const message = "Error message";
      const duration = 0;
      const showClose = false;

      jest.spyOn(service, "showNotification");
      service.showError(message, duration, showClose);

      expect(service.showNotification).toHaveBeenCalledWith({
        message,
        type: "error",
        duration,
        showCloseButton: showClose,
      });
    });

    it("showWarning should call showNotification with correct config", () => {
      const message = "Warning message";
      const duration = 10000;
      const showClose = true;

      jest.spyOn(service, "showNotification");
      service.showWarning(message, duration, showClose);

      expect(service.showNotification).toHaveBeenCalledWith({
        message,
        type: "warning",
        duration,
        showCloseButton: showClose,
      });
    });

    it("showInfo should call showNotification with correct config", () => {
      const message = "Info message";
      const duration = 2500;
      const showClose = false;

      jest.spyOn(service, "showNotification");
      service.showInfo(message, duration, showClose);

      expect(service.showNotification).toHaveBeenCalledWith({
        message,
        type: "info",
        duration,
        showCloseButton: showClose,
      });
    });

    it("shortcut methods should use default parameters when not provided", () => {
      jest.spyOn(service, "showNotification");

      service.showSuccess("Default success");
      expect(service.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "success",
          duration: 3000,
          showCloseButton: true,
        })
      );

      service.showError("Default error");
      expect(service.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          duration: 0,
          showCloseButton: true,
        })
      );

      service.showWarning("Default warning");
      expect(service.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "warning",
          duration: 5000,
          showCloseButton: true,
        })
      );

      service.showInfo("Default info");
      expect(service.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "info",
          duration: 5000,
          showCloseButton: true,
        })
      );
    });
  });
});
