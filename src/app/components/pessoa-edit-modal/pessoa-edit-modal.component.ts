import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Pessoa } from '@models/pessoa.model';
import { cpfValidator } from '@utils/validators/cpf.validator';
import { emailValidator } from '@utils/validators/email.validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pessoa-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pessoa-edit-modal.component.html',
  styleUrls: ['./pessoa-edit-modal.component.scss'],
})
export class PessoaEditModalComponent implements OnInit {
  @Input() pessoa!: Pessoa;
  @Input() isSubmitting: boolean = false;

  editForm!: FormGroup;

  sexoOptions: Array<{ value: 'M' | 'F' | 'Outro'; label: string }> = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
  ];

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    if (!this.pessoa) {
      console.error('Pessoa object is required for PessoaEditModalComponent');
      this.activeModal.dismiss('no pessoa data');
      return;
    }
    this.createForm();
  }

  private createForm(): void {
    this.editForm = this.fb.group({
      nome: [this.pessoa.nome, [Validators.required, Validators.minLength(2)]],
      cpf: [
        this.formatCpf(this.pessoa.cpf),
        [Validators.required, cpfValidator()],
      ],
      sexo: [this.pessoa.sexo, [Validators.required]],
      email: [this.pessoa.email, [Validators.required, emailValidator()]],
      telefone: [
        this.pessoa.telefone,
        [Validators.required, Validators.minLength(10)],
      ],
    });
    this.editForm.markAllAsTouched();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedPessoa: Pessoa = {
        ...this.pessoa,
        ...this.editForm.value,
        cpf: this.editForm.get('cpf')?.value.replace(/\D/g, ''),
        telefone: this.editForm.get('telefone')?.value.replace(/\D/g, ''),
      };
      this.activeModal.close(updatedPessoa);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach((key) => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.editForm.get(fieldName);
    if (control?.errors && control.touched) {
      const errors = control.errors;
      const fieldLabel = this.getFieldLabel(fieldName);

      if (errors['required']) {
        return `${fieldLabel} é obrigatório`;
      }
      if (fieldName === 'telefone' && errors['minlength']) {
        return `${fieldLabel} deve ter pelo menos ${errors['minlength'].requiredLength} dígitos`;
      }
      if (errors['minlength']) {
        return `${fieldLabel} deve ter pelo menos ${errors['minlength'].requiredLength} caracteres`;
      }
      if (errors['cpfInvalid']) {
        return 'CPF inválido';
      }
      if (errors['emailInvalid']) {
        return 'Email inválido';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      cpf: 'CPF',
      sexo: 'Sexo',
      email: 'Email',
      telefone: 'Telefone',
    };
    return labels[fieldName] || fieldName;
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      input.value = value;
      this.editForm.get('cpf')?.setValue(value, { emitEvent: false });
    }
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    let formattedValue = value;

    if (value.length <= 10) {
      formattedValue = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (value.length === 11) {
      formattedValue = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    input.value = formattedValue;
    this.editForm
      .get('telefone')
      ?.setValue(formattedValue, { emitEvent: false });
  }

  private formatCpf(cpf: string): string {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length === 11) {
      return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }
}
