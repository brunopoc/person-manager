import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pessoa } from '@models/pessoa.model';

@Component({
  selector: 'app-pessoa-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pessoa-card.component.html',
  styleUrls: ['./pessoa-card.component.scss']
})
export class PessoaCardComponent {
  @Input() pessoa!: Pessoa;
  @Output() editPessoa = new EventEmitter<Pessoa>();
  @Output() deletePessoa = new EventEmitter<Pessoa>();

  onEdit(): void {
    this.editPessoa.emit(this.pessoa);
  }

  onDelete(): void {
    this.deletePessoa.emit(this.pessoa);
  }

  formatCpf(cpf: string): string {
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getSexoLabel(sexo: string): string {
    switch (sexo) {
      case 'M': return 'Masculino';
      case 'F': return 'Feminino';
      case 'Outro': return 'Outro';
      default: return sexo;
    }
  }
}