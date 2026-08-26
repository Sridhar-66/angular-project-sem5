import { Injectable, signal, computed, effect } from '@angular/core';
import { supabase } from './supabase.client';
import { AuthService } from './auth.service';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<Notification[]>([]);
  readonly loading = signal(false);

  readonly unreadCount = computed(() => 
    this.notifications().filter((n) => !n.is_read).length
  );

  // Signal for the latest notification to trigger toasts
  readonly latestToast = signal<Notification | null>(null);

  private realtimeChannel: any = null;

  constructor(private auth: AuthService) {
    // When user changes, setup subscriptions
    effect(() => {
      const user = this.auth.user();
      if (user) {
        this.loadInitialNotifications(user.id);
        this.setupRealtime(user.id);
      } else {
        this.cleanup();
      }
    });
  }

  private async loadInitialNotifications(userId: string) {
    this.loading.set(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      this.notifications.set(data as Notification[]);
    }
    this.loading.set(false);
  }

  private setupRealtime(userId: string) {
    // Clean up any existing channel
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
    }

    this.realtimeChannel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          this.notifications.update((list) => [newNotif, ...list]);
          this.latestToast.set(newNotif);
          // clear toast signal after a moment so it can fire again if needed
          setTimeout(() => this.latestToast.set(null), 100);
        }
      )
      .subscribe();
  }

  private cleanup() {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
    this.notifications.set([]);
    this.latestToast.set(null);
  }

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      this.notifications.update((list) =>
        list.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    }
  }

  async markAllAsRead() {
    const user = this.auth.user();
    if (!user) return;
    
    const unreadIds = this.notifications()
      .filter((n) => !n.is_read)
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    // Use update with in filter or just update where user_id = user.id and is_read = false
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (!error) {
      this.notifications.update((list) =>
        list.map((n) => ({ ...n, is_read: true }))
      );
    }
  }
}
