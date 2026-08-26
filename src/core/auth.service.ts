import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from './supabase.client';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'delivery' | 'customer';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  address?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Reactive signals — components subscribe to these directly
  readonly user = signal<User | null>(null);
  readonly profile = signal<Profile | null>(null);
  readonly loading = signal<boolean>(true);

  constructor(private router: Router) {
    this.initSession();
  }

  /** Bootstrap: restore session from local storage */
  private async initSession() {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      this.user.set(data.session.user);
      await this.loadProfile(data.session.user.id);
    }
    this.loading.set(false);

    // Listen to auth state changes (login / logout / token refresh)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      this.user.set(session?.user ?? null);
      if (session?.user) {
        await this.loadProfile(session.user.id);
      } else {
        this.profile.set(null);
      }
    });
  }

  private async loadProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      this.profile.set(data as Profile);
    }
  }

  /** Update the current user's profile */
  async updateProfile(fields: { full_name?: string; address?: string }): Promise<void> {
    const userId = this.user()?.id;
    if (!userId) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', userId);
    if (error) throw error;
    this.profile.update((p) => p ? { ...p, ...fields } : p);
  }

  /** Sign up with email/password + role + full_name in user_metadata */
  async signUp(email: string, password: string, fullName: string, role: UserRole) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    if (error) throw error;
    return data;
  }

  /** Send password reset email */
  async resetPasswordForEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  /** Update password after clicking reset link (must have active session) */
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  /** Sign in with email/password */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  /** Sign out and redirect to login */
  async signOut() {
    await supabase.auth.signOut();
    this.user.set(null);
    this.profile.set(null);
    this.router.navigate(['/login']);
  }

  /** Navigate to the correct dashboard based on role */
  navigateToDashboard(role: UserRole) {
    const routes: Record<UserRole, string> = {
      admin: '/admin',
      delivery: '/delivery',
      customer: '/customer',
    };
    this.router.navigate([routes[role]]);
  }

  get currentRole(): UserRole | null {
    return this.profile()?.role ?? null;
  }

  get isAuthenticated(): boolean {
    return !!this.user();
  }
}
