import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaSearchComponent } from '@components/pessoa-search/pessoa-search.component';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [CommonModule, PessoaSearchComponent],
  templateUrl: './buscar.component.html',
})
export class BuscarComponent {}