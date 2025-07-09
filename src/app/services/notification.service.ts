import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  PopupNotificationComponent,
  NotificationConfig,
} from "@components/popup-notification/popup-notification.component";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private modalService: NgbModal) {}

  /**
   * Exibe uma notificação popup.
   * @param config A configuração da notificação (mensagem, tipo, duração, botão de fechar).
   * @returns Uma Promise que resolve quando o modal é fechado ou descartado.
   */
  showNotification(config: NotificationConfig): Promise<any> {
    const modalRef = this.modalService.open(PopupNotificationComponent, {
      centered: true,
      backdropClass: "custom-notification-backdrop", // Opcional: para estilizar o fundo
      windowClass: "custom-notification-window", // Opcional: para estilizar a janela do modal
      animation: true,
      scrollable: false,
      keyboard: config.showCloseButton,
      backdrop: true,
    });

    modalRef.componentInstance.config = config;

    return modalRef.result;
  }

  /**
   * Exibe uma notificação popup.
   * @param message Informa a mensagem que deve ser apresentada ao usuario
   * @param duration Quanto tempo a notificação deve permanecer visivel
   * @param showCloseButton Informa se o botão de fechar a notificação deve estar visivel
   * @returns Uma Promise que resolve quando o modal é fechado ou descartado.
   */
  showSuccess(
    message: string,
    duration: number = 3000,
    showCloseButton: boolean = true
  ): Promise<any> {
    return this.showNotification({
      message,
      type: "success",
      duration,
      showCloseButton,
    });
  }

  showError(
    message: string,
    duration: number = 0,
    showCloseButton: boolean = true
  ): Promise<any> {
    return this.showNotification({
      message,
      type: "error",
      duration,
      showCloseButton,
    });
  }

  showWarning(
    message: string,
    duration: number = 5000,
    showCloseButton: boolean = true
  ): Promise<any> {
    return this.showNotification({
      message,
      type: "warning",
      duration,
      showCloseButton,
    });
  }

  showInfo(
    message: string,
    duration: number = 5000,
    showCloseButton: boolean = true
  ): Promise<any> {
    return this.showNotification({
      message,
      type: "info",
      duration,
      showCloseButton,
    });
  }
}
