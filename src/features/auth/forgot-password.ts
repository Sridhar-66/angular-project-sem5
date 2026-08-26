import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordComponent {
  email = '';
  loading = signal(false);
  error = signal('');
  sent = signal(false);

  constructor(private auth: AuthService) {}

  async onSubmit() {
    if (!this.email.trim()) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.resetPasswordForEmail(this.email.trim());
      this.sent.set(true);
    } catch (e: any) {
      this.error.set(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
