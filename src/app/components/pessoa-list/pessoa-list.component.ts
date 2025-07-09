import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PessoaCardComponent } from '@components/pessoa-card/pessoa-card.component';
import { Pessoa } from '@models/pessoa.model';

@Component({
  selector: 'app-pessoa-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PessoaCardComponent],
  templateUrl: './pessoa-list.component.html',
  styleUrls: ['./pessoa-list.component.scss']
})
export class PessoaListComponent implements OnInit {
  @Input() pessoas: Pessoa[] = [];
  @Input() isLoading: boolean = false;
  @Output() editPessoa = new EventEmitter<Pessoa>();
  @Output() deletePessoa = new EventEmitter<Pessoa>();

  ngOnInit(): void {}

  onEditPessoa(pessoa: Pessoa): void {
    this.editPessoa.emit(pessoa);
  }

  onDeletePessoa(pessoa: Pessoa): void {
    this.deletePessoa.emit(pessoa);
  }

  trackByPessoa(index: number, pessoa: Pessoa): number {
    return pessoa.id || index;
  }
}