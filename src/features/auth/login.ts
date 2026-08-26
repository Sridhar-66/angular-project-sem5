import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.signIn(this.email, this.password);
      // Wait briefly for profile to load, then navigate
      await new Promise((r) => setTimeout(r, 300));
      const role = this.auth.currentRole;
      if (role) this.auth.navigateToDashboard(role);
      else this.router.navigate(['/login']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Login failed. Please check your credentials.');
    } finally {
      this.loading.set(false);
    }
  }
}
