import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"; 

export interface NotificationConfig {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  showCloseButton?: boolean;
}

@Component({
  selector: "app-popup-notification",
  standalone: true,
  imports: [CommonModule],
  styleUrl: "./popup-notification.component.scss",
  templateUrl: "./popup-notification.component.html",
})
export class PopupNotificationComponent implements OnInit, OnDestroy {
  constructor(public activeModal: NgbActiveModal) {}

  title: string = "";
  private timer: any; 

  @Input() config: NotificationConfig = {
    message: "",
    type: "info",
    duration: 0,
    showCloseButton: true,
  };

  @Output() closed = new EventEmitter<void>();

  ngOnInit() {
    this.title = this.getTitle();
    this.startAutoCloseTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  startAutoCloseTimer() {
    if (this.config.duration && this.config.duration > 0) {
      this.timer = setTimeout(() => {
        this.closeNotification();
      }, this.config.duration);
    }
  }

  closeNotification() {
    this.activeModal.close("closed by timer or button");
  }

  dismissNotification() {
    this.activeModal.dismiss("dismissed by user");
  }

  getTitle(): string {
    switch (this.config.type) {
      case "success":
        return "Sucesso";
      case "error":
        return "Erro";
      case "warning":
        return "Atenção";
      case "info":
      default:
        return "Informação";
    }
  }
}
