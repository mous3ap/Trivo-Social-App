import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink , RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {

 userData: any = null;
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly userService = inject(UserService);

  unreadCount: number = 0;

  ngOnInit(): void {

    // Get unread count
    this.notificationService.unreadCount$
      .subscribe(count => {
        this.unreadCount = count;
      });

    // First fetch
    this.notificationService.getNotifications();

    // Start auto refresh
    this.notificationService.startPolling();

    this.userService.userData.subscribe(user => {
  this.userData = user;
});

  }
  ngOnDestroy(): void {
  this.notificationService.stopPolling();
}

  logOut(): void {
    this.authService.signOut();
  }

}