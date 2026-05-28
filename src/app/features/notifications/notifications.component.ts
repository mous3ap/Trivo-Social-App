import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';


import {
  Notification,
} from '../../core/models/notification.interface';

import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';
import { TimeAgoPipe } from '../../shared/pipes/date-pipe';

@Component({
  selector: 'app-notifications',
  imports: [TimeAgoPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {

  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  notifications = signal<Notification[]>([]);

  unreadCount = signal(0);

  ngOnInit(): void {

    this.notificationService.getNotifications();

    this.notificationService.notifications$
      .subscribe((data) => {

        this.notifications.set(data);

      });

    this.notificationService.unreadCount$
      .subscribe((count) => {

        this.unreadCount.set(count);

      });

  }

  getNotificationText(type: string): string {

    switch (type) {

      case 'like':
        return 'liked your post';

      case 'comment':
        return 'commented on your post';

      case 'follow':
        return 'started following you';

      case 'share':
        return 'shared your post';

      default:
        return 'Reacted with you';

    }

  }

  markAsRead(id: string): void {

    this.notificationService.markAsRead(id);

  }

  markAllAsRead(): void {

    this.notificationService.markAllAsRead('');

  }

  goToNotification(notification: Notification): void {

  // mark as read
  if (!notification.isRead) {
    this.notificationService.markAllAsRead(notification._id);
  }

  // navigate to post
  this.router.navigate(['/details', notification.entityId]);

}

}