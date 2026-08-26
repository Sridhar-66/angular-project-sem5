import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../core/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.html',
})
export class NotificationBellComponent {
  dropdownOpen = false;

  constructor(
    public notifSvc: NotificationService,
    private eRef: ElementRef
  ) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  async markAsRead(id: string) {
    await this.notifSvc.markAsRead(id);
  }

  async markAllRead() {
    await this.notifSvc.markAllAsRead();
  }
}
