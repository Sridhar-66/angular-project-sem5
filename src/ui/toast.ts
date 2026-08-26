import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../core/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
})
export class ToastComponent {
  activeToasts = signal<Notification[]>([]);

  constructor(private notifSvc: NotificationService) {
    effect(() => {
      const latest = this.notifSvc.latestToast();
      if (latest) {
        this.activeToasts.update(list => [...list, latest]);
        
        // Auto-dismiss after 5s
        setTimeout(() => {
          this.activeToasts.update(list => list.filter(t => t.id !== latest.id));
        }, 5000);
      }
    });
  }

  dismiss(id: string) {
    this.activeToasts.update(list => list.filter(t => t.id !== id));
  }
}
