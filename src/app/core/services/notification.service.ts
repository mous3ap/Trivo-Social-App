import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Subscription,
} from 'rxjs';

import {
  Notification,
  NotificationsResponse,
} from '../models/notification.interface';

import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private readonly httpClient = inject(HttpClient);

  private notificationsData = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsData.asObservable();

  private unreadCountData = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountData.asObservable();

  private allNotifications: Notification[] = [];

  private pollingSub!: Subscription;

  private limit: number = 50;

  getNotifications(): void {

    this.httpClient
      .get<NotificationsResponse>(
        environment.baseUrl +
        `/notifications?unread=false&page=1&limit=${this.limit}`
      )

      .subscribe({

        next: (res) => {

          const newNotifications = res.data.notifications;

          this.mergeNotifications(newNotifications);

          this.updateState();

        },

        error: (err) => {
          console.log(err);
        }

      });

  }

  private mergeNotifications(newData: Notification[]): void {

    const map = new Map<string, Notification>();

    this.allNotifications.forEach((n) => {
      map.set(n._id, n);
    });

    newData.forEach((n) => {
      map.set(n._id, n);
    });

    this.allNotifications = Array.from(map.values());

  }

  markAsRead(id: string): void {

    this.httpClient
      .patch(
        `${environment.baseUrl}/notifications/${id}/read`,
        {}
      )

      .subscribe({

        next: () => {

          this.allNotifications = this.allNotifications.map((n) =>

            n._id === id
              ? { ...n, isRead: true }
              : n

          );

          this.updateState();

        },

        error: (err) => {
          console.log(err);
        }

      });

  }

  markAllAsRead(_id: string): void {

    this.allNotifications = this.allNotifications.map((n) => ({
      ...n,
      isRead: true,
    }));

    this.updateState();

  }

  startPolling(): void {

    if (this.pollingSub) return;

    this.pollingSub = interval(60000).subscribe(() => {

      this.getNotifications();

    });

  }

  stopPolling(): void {

    if (this.pollingSub) {

      this.pollingSub?.unsubscribe();

    }

  }

  private updateState(): void {

    this.notificationsData.next([...this.allNotifications]);

    const unread = this.allNotifications.filter(
      (n) => !n.isRead
    ).length;

    this.unreadCountData.next(unread);

  }

}