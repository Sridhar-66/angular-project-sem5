import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styles: [`
    :host ::ng-deep app-signup .auth-page {
      min-height: auto;
      background: none;
      padding: 0;
    }
  `]
})
export class LandingComponent {}
