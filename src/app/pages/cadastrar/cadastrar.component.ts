import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaFormComponent } from '@components/pessoa-form/pessoa-form.component';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [CommonModule, PessoaFormComponent],
  templateUrl: './cadastrar.component.html',
})
export class CadastrarComponent {}