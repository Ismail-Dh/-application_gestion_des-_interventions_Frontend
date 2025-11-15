import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { Notification, NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-header-resp',
  templateUrl: './header-resp.component.html',
  standalone:true,
  styleUrls: ['./header-resp.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatCardModule,
    
  ],
})
export class HeaderRespComponent {
  
    
   
       logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    }

    constructor(private router: Router,private notificationService: NotificationService) {}
      
        notifications: Notification[] = [];
        unreadCount = 0;
       userId=1;
      
       
      
        ngOnInit() {
          this.loadNotifications();
        }
      
        loadNotifications() {
          
          this.notificationService.getUserNotifications(this.userId).subscribe(res => {
            // Trier de plus récent à plus ancien
            this.notifications = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.unreadCount = this.notifications.filter(n => !n.read).length;
          });
        }
      
        markAsRead(notif: Notification) {
          if (!notif.read) {
            this.notificationService.markAsRead(notif.id).subscribe(() => {
              notif.read = true;
              this.unreadCount = this.notifications.filter(n => !n.read).length;
      
              
            });
          }
        }
      
        markAllAsRead() {
          
          this.notificationService.markAllAsRead(this.userId).subscribe(() => {
            this.notifications.forEach(n => n.read = true);
            this.unreadCount = 0;
          });
        }
}