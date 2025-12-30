import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../../services/role.service';
import { AuthService } from '../../../services/auth';
import { Role } from '../../../models/role.model';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-list.html',
  styleUrls: ['./role-list.css']
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  isLoading = true;
  errorMessage = '';
  
  // Permissions
  canCreate = false;
  canEdit = false;
  canDelete = false;

  constructor(
    private roleService: RoleService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.loadRoles();
  }

  checkPermissions(): void {
    this.canCreate = this.authService.hasPermission('create_role');
    this.canEdit = this.authService.hasPermission('edit_role');
    this.canDelete = this.authService.hasPermission('delete_role');
  }

  loadRoles(): void {
    this.isLoading = true;
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.roles;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load roles';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  viewAccessMatrix(): void {
    this.router.navigate(['/dashboard/access-matrix']);
  }

  editRole(roleId: string): void {
    this.router.navigate(['/dashboard/roles', roleId, 'edit']);
  }

  deleteRole(role: Role): void {
    if (role.isSystemDefault) {
      alert('Cannot delete system default roles');
      return;
    }

    if (confirm(`Delete role "${role.name}"? This cannot be undone.`)) {
      this.roleService.deleteRole(role._id).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => r._id !== role._id);
        },
        error: (error) => {
          alert('Failed to delete role');
          console.error('Error:', error);
        }
      });
    }
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getPermissionCount(role: Role): number {
    return role.permissions.length;
  }

  canDeleteRole(role: Role): boolean {
    return this.canDelete && !role.isSystemDefault;
  }

  canEditRole(role: Role): boolean {
    return this.canEdit || (this.authService.hasRole('SuperAdmin') && !role.isSystemDefault);
  }
}