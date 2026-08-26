import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignupComponent } from '../auth/signup';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, SignupComponent],
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
