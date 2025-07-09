import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cpfValidator } from '@utils/validators/cpf.validator';
import { Pessoa } from '@models/pessoa.model';
import { PessoasService } from '@services/pessoas.service';

@Component({
  selector: 'app-pessoa-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pessoa-search.component.html',
  styleUrl: './pessoa-search.component.scss'
})
export class PessoaSearchComponent implements OnInit {
  searchForm!: FormGroup;
  pessoa: Pessoa | null = null;
  isSearching = false;
  searchPerformed = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private pessoasService: PessoasService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.searchForm = this.fb.group({
      cpf: ['', [Validators.required, cpfValidator()]]
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.isSearching = true;
      this.errorMessage = '';
      this.pessoa = null;
      
      const cpf = this.searchForm.value.cpf.replace(/\D/g, '');

      this.pessoasService.getPessoaByCpf(cpf).subscribe({
        next: (pessoa) => {
          this.searchPerformed = true;
          if (pessoa) {
            this.pessoa = pessoa;
          } else {
            this.errorMessage = 'Pessoa não encontrada com o CPF informado.';
          }
        },
        error: (error) => {
          this.searchPerformed = true;
          this.errorMessage = error.message || 'Erro ao buscar pessoa. Tente novamente.';
        },
        complete: () => {
          this.isSearching = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.searchForm.controls).forEach(key => {
      const control = this.searchForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  onCpfInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
      value = value.substring(0, 11);
    }
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    input.value = value;
    this.searchForm.patchValue({ cpf: value });
  }

  getErrorMessage(): string {
    const control = this.searchForm.get('cpf');
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return 'CPF é obrigatório';
      }
      if (control.errors['cpfInvalido']) {
        return 'CPF inválido';
      }
    }
    return '';
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.pessoa = null;
    this.errorMessage = '';
    this.searchPerformed = false;
  }

  formatCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getSexoLabel(sexo: string): string {
    const labels: { [key: string]: string } = {
      'M': 'Masculino',
      'F': 'Feminino',
      'Outro': 'Outro'
    };
    return labels[sexo] || sexo;
  }
}