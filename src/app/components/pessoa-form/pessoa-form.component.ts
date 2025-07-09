import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { cpfValidator } from "@utils/validators/cpf.validator";
import { emailValidator } from "@utils/validators/email.validator";
import { Pessoa } from "@models/pessoa.model";
import { PessoasService } from "@services/pessoas.service";
import { NotificationService } from "@services/notification.service";

@Component({
  selector: "app-pessoa-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./pessoa-form.component.html",
})
export class PessoaFormComponent implements OnInit {
  pessoaForm!: FormGroup;
  isSubmitting: boolean = false;

  sexoOptions: Array<{ value: "M" | "F" | "Outro"; label: string }> = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Feminino" },
    { value: "Outro", label: "Outro" },
  ];

  constructor(
    private fb: FormBuilder,
    private pessoasService: PessoasService,
    private notificationService: NotificationService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.pessoaForm = this.fb.group({
      nome: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      cpf: ["", [Validators.required, cpfValidator()]],
      sexo: ["", Validators.required],
      email: ["", [Validators.required, emailValidator()]],
      telefone: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.pessoaForm.valid) {
      this.isSubmitting = true;

      const pessoa: Pessoa = {
        nome: this.pessoaForm.value.nome,
        cpf: this.pessoaForm.value.cpf.replace(/\D/g, ""),
        sexo: this.pessoaForm.value.sexo,
        email: this.pessoaForm.value.email,
        telefone: this.pessoaForm.value.telefone.replace(/\D/g, ""),
      };

      this.pessoasService.addPessoa(pessoa).subscribe({
        next: (response: Pessoa) => {
          this.notificationService.showSuccess(
            "Pessoa cadastrada com sucesso!"
          );
          this.pessoaForm.reset();
        },
        error: (error: any) => {
          const errorMsg =
            error.message || "Erro ao cadastrar pessoa. Tente novamente.";
          this.notificationService.showError(errorMsg);
          this.pessoaForm.reset();
          this.isSubmitting = false;
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.pessoaForm.controls).forEach((key) => {
      const control = this.pessoaForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.pessoaForm.get(fieldName);
    if (control && control.errors && control.touched) {
      const errors = control.errors;

      if (errors["required"]) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (errors["minlength"]) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${
          errors["minlength"].requiredLength
        } caracteres`;
      }
      if (errors["cpfInvalid"]) {
        return "CPF inválido";
      }
      if (errors["emailInvalid"]) {
        return "Email inválido";
      }
      if (errors["maxlength"]) {
        return `${this.getFieldLabel(fieldName)} deve ter no máximo ${
          errors["maxlength"].requiredLength
        } caracteres`;
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nome: "Nome",
      cpf: "CPF",
      sexo: "Sexo",
      email: "Email",
      telefone: "Telefone",
    };
    return labels[fieldName] || fieldName;
  }

  onCpfInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");

    if (value.length >= 11) {
      value = value.substring(0, 11);
    }

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    input.value = value;
    this.pessoaForm.patchValue({ cpf: value });
  }

  onTelefoneInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");

    if (value.length >= 11) {
      value = value.substring(0, 11);
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length >= 6) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length >= 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }

    input.value = value;
    this.pessoaForm.patchValue({ telefone: value });
  }
}
