import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.html',
})
export class AccountComponent implements OnInit {
  // Profile fields
  fullName = signal('');

  // Password fields
  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  // UI state
  savingProfile = signal(false);
  savingPassword = signal(false);
  profileSuccess = signal('');
  profileError = signal('');
  passwordSuccess = signal('');
  passwordError = signal('');

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.fullName.set(this.auth.profile()?.full_name ?? '');
  }

  get roleLabel(): string {
    const map: Record<string, string> = {
      admin: '⚙️ Admin',
      delivery: '🚚 Delivery Boy',
      customer: '🛍️ Customer',
    };
    return map[this.auth.profile()?.role ?? ''] ?? this.auth.profile()?.role ?? '';
  }

  get roleClass(): string {
    const map: Record<string, string> = {
      admin: 'badge-admin',
      delivery: 'badge-delivery',
      customer: 'badge-customer',
    };
    return map[this.auth.profile()?.role ?? ''] ?? '';
  }

  get passwordsMatch(): boolean {
    return this.newPassword() === this.confirmPassword();
  }

  get isPasswordFormValid(): boolean {
    return this.newPassword().length >= 6 && this.passwordsMatch;
  }

  async saveProfile(): Promise<void> {
    if (!this.fullName().trim()) return;
    this.savingProfile.set(true);
    this.profileSuccess.set('');
    this.profileError.set('');
    try {
      await this.auth.updateProfile({ full_name: this.fullName().trim() });
      this.profileSuccess.set('Profile updated successfully!');
    } catch (e: any) {
      this.profileError.set(e.message ?? 'Failed to update profile.');
    } finally {
      this.savingProfile.set(false);
    }
  }

  async changePassword(): Promise<void> {
    if (!this.isPasswordFormValid) return;
    this.savingPassword.set(true);
    this.passwordSuccess.set('');
    this.passwordError.set('');
    try {
      await this.auth.updatePassword(this.newPassword());
      this.passwordSuccess.set('Password changed successfully!');
      this.currentPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
    } catch (e: any) {
      this.passwordError.set(e.message ?? 'Failed to change password.');
    } finally {
      this.savingPassword.set(false);
    }
  }
}
