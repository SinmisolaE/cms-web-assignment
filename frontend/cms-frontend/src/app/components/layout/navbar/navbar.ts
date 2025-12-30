import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  isProfileDropdownOpen = false;
  notifications = [
    { id: 1, message: 'New article published', time: '10 min ago', read: false },
    { id: 2, message: 'User registered', time: '1 hour ago', read: true }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  navigateToProfile(): void {
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/dashboard/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    return user?.firstName?.charAt(0) || 'U';
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}