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

  // Password strength checks
  get passwordStrengthScore(): number {
    let score = 0;
    const p = this.password;
    if (!p) return 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[@$!%*?&]/.test(p)) score++;
    return score;
  }

  get strengthColor(): string {
    const score = this.passwordStrengthScore;
    if (score === 0) return 'var(--color-surface-3)';
    if (score <= 2) return 'var(--color-danger)';
    if (score <= 4) return 'var(--color-warning)';
    return 'var(--color-success)';
  }

  get strengthLabel(): string {
    const score = this.passwordStrengthScore;
    if (score === 0) return '';
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Good';
    return 'Strong';
  }

  get isPasswordStrong() {
    return this.passwordStrengthScore === 5;
  }

  constructor(private auth: AuthService) {}

  async onSubmit() {
    if (!this.fullName || !this.email || !this.password) return;

    // Strong password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(this.password)) {
      this.error.set('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

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
