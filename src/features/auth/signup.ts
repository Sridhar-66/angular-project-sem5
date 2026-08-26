import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../../core/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
})
export class SignupComponent {
  fullName = '';
  email = '';
  password = '';
  role: UserRole = 'customer';
  loading = signal(false);
  error = signal('');
  success = signal(false);

  constructor(private auth: AuthService) {}

  async onSubmit() {
    if (!this.fullName || !this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.signUp(this.email, this.password, this.fullName, this.role);
      this.success.set(true);
    } catch (e: any) {
      this.error.set(e.message ?? 'Signup failed.');
    } finally {
      this.loading.set(false);
    }
  }
}
