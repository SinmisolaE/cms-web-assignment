import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  errorMessage = '';
  
  // Permissions
  canDelete = false;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.loadUsers();
  }

  checkPermissions(): void {
    this.canDelete = this.authService.hasPermission('delete_user');
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  deleteUser(userId: string): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadUsers();
          alert('User deleted successfully');
        }
      },
      error: (error) => {
        alert('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    });
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
