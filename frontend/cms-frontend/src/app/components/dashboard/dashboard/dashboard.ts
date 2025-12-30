import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  isSidebarCollapsed = false;

  constructor(public authService: AuthService) {
    console.log('Dashboard - Current User:', this.authService.getCurrentUser());
    console.log('Dashboard - Is logged in:', this.authService.isLoggedIn());
    console.log('Dashboard - Access token:', this.authService.getAccessToken());
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Check if user can access dashboard
  canAccessDashboard(): boolean {
    return this.authService.hasPermission('view_dashboard') || 
           this.authService.hasAnyPermission(['view_published_only', 'view_roles', 'view_users']);
  }
}