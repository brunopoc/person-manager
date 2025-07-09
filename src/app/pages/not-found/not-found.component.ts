import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { ErrorMessageComponent } from '@components/error-message/error-message.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorMessageComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  constructor(private location: Location) {}
  
  goBack(): void {
    this.location.back();
  }
}