import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { PessoasService } from "@services/pessoas.service";
import { NotificationService } from "@services/notification.service";
import { Pessoa } from "@models/pessoa.model";
import { PessoaListComponent } from "@components/pessoa-list/pessoa-list.component";
import { PessoaEditModalComponent } from "@components/pessoa-edit-modal/pessoa-edit-modal.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule, PessoaListComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  pessoas: Pessoa[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private pessoasService: PessoasService,
    private notificationService: NotificationService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadPessoas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPessoas(): void {
    this.isLoading = true;
    this.pessoasService
      .getPessoas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pessoas: Pessoa[]) => {
          this.pessoas = pessoas;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError("Erro ao carregar pessoas.");
          console.error("Erro ao carregar pessoas:", error);
        },
      });
  }

  startEdit(pessoa: Pessoa): void {
    const modalRef = this.modalService.open(PessoaEditModalComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.componentInstance.pessoa = { ...pessoa };

    modalRef.result.then(
      (result: Pessoa) => {
        this.onSubmitEdit(result);
      },
      (reason) => {
        this.notificationService.showInfo("Edição cancelada.");
      }
    );
  }

  onSubmitEdit(updatedPessoa: Pessoa): void {
    this.isLoading = true;

    this.pessoasService
      .updatePessoa(updatedPessoa)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Pessoa) => {
          const index = this.pessoas.findIndex(
            (p) => p.id === updatedPessoa.id
          );
          if (index !== -1) {
            this.pessoas[index] = response;
          }
          this.notificationService.showSuccess(
            "Pessoa atualizada com sucesso!"
          );
          this.isLoading = false;
        },
        error: (error) => {
          this.notificationService.showError("Erro ao atualizar pessoa.");
          console.error("Erro ao atualizar pessoa:", error);
          this.isLoading = false;
        },
      });
  }

  deletePessoa(pessoa: Pessoa): void {
    if (confirm(`Tem certeza que deseja remover ${pessoa.nome}?`)) {
      this.pessoasService
        .deletePessoa(pessoa.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.pessoas = this.pessoas.filter((p) => p.id !== pessoa.id);
            this.notificationService.showSuccess(
              `${pessoa.nome} foi removido com sucesso!`
            );
          },
          error: (error) => {
            console.error("Erro ao remover pessoa:", error);
            this.notificationService.showError(
              "Erro ao remover pessoa. Tente novamente."
            );
          },
        });
    }
  }
}
