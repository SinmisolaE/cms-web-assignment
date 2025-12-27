import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h3 class="mb-0">Dashboard</h3>
        </div>
        <div class="card-body">
          <h4>Welcome to CMS Dashboard!</h4>
          <p>Login successful 🎉</p>
          
          <div class="mt-4">
            <h5>User Info:</h5>
            <div *ngIf="user" class="alert alert-info">
              <p><strong>Name:</strong> {{user.fullName}}</p>
              <p><strong>Email:</strong> {{user.email}}</p>
              <p><strong>Role:</strong> {{user.role}}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <button (click)="logout()" class="btn btn-danger">
              Logout
            </button>
            <a routerLink="/login" class="btn btn-secondary ms-2">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Get user from localStorage
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.user = JSON.parse(userJson);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}