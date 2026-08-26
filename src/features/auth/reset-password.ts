import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { supabase } from '../../core/supabase.client';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPasswordComponent implements OnInit {
  newPassword = '';
  confirmPassword = '';

  loading = signal(false);
  error = signal('');
  done = signal(false);
  // Track whether we have a valid recovery session from the email link
  sessionReady = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Supabase exchanges the token in the URL hash and fires an auth event.
    // Listen for the PASSWORD_RECOVERY event to know the session is active.
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        this.sessionReady.set(true);
      }
    });

    // If the user already has a session (e.g. page refreshed), treat as ready too.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        this.sessionReady.set(true);
      }
    });
  }

  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  get passwordStrengthScore(): number {
    let score = 0;
    const p = this.newPassword;
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

  get isValid(): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(this.newPassword) && this.passwordsMatch;
  }

  async onSubmit(): Promise<void> {
    if (!this.isValid) return;
    this.loading.set(true);
    this.error.set('');

    try {
      await this.auth.updatePassword(this.newPassword);
      this.done.set(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => this.router.navigate(['/login']), 3000);
    } catch (e: any) {
      this.error.set(e.message ?? 'Failed to update password. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
