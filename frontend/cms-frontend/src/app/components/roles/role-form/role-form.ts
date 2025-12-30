import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../../services/role.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-form.html',
  styleUrls: ['./role-form.css']
})
export class RoleFormComponent implements OnInit {
  // Form data
  name = '';
  description = '';
  selectedPermissions: string[] = [];
  
  // Available permissions
  allPermissions = [
    // Article permissions
    { name: 'create_article', label: 'Create Articles', module: 'Articles' },
    { name: 'edit_article', label: 'Edit Articles', module: 'Articles' },
    { name: 'delete_article', label: 'Delete Articles', module: 'Articles' },
    { name: 'publish_article', label: 'Publish Articles', module: 'Articles' },
    { name: 'view_all_articles', label: 'View All Articles', module: 'Articles' },
    { name: 'view_published_only', label: 'View Published Only', module: 'Articles' },
    
    // User permissions
    { name: 'create_user', label: 'Create Users', module: 'Users' },
    { name: 'edit_user', label: 'Edit Users', module: 'Users' },
    { name: 'delete_user', label: 'Delete Users', module: 'Users' },
    { name: 'view_users', label: 'View Users', module: 'Users' },
    
    // Role permissions
    { name: 'create_role', label: 'Create Roles', module: 'Roles' },
    { name: 'edit_role', label: 'Edit Roles', module: 'Roles' },
    { name: 'delete_role', label: 'Delete Roles', module: 'Roles' },
    { name: 'view_roles', label: 'View Roles', module: 'Roles' }
  ];

  // Grouped permissions
  permissionGroups: any = {};

  // Component state
  isEditMode = false;
  roleId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.groupPermissions();
    this.checkRoute();
  }

  groupPermissions(): void {
    this.permissionGroups = {};
    this.allPermissions.forEach(perm => {
      if (!this.permissionGroups[perm.module]) {
        this.permissionGroups[perm.module] = [];
      }
      this.permissionGroups[perm.module].push(perm);
    });
  }

  checkRoute(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.roleId = id;
      this.loadRole(id);
    }
  }

  loadRole(id: string): void {
    this.isLoading = true;
    this.roleService.getRoleById(id).subscribe({
      next: (role) => {
        this.name = role.name;
        this.description = role.description;
        this.selectedPermissions = [...role.permissions];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load role';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }
  get permissionModuleKeys(): string[] {
    return Object.keys(this.permissionGroups);
  }

  togglePermission(permissionName: string): void {
    const index = this.selectedPermissions.indexOf(permissionName);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permissionName);
    }
  }

  isPermissionSelected(permissionName: string): boolean {
    return this.selectedPermissions.includes(permissionName);
  }

  selectAllInGroup(module: string): void {
    const modulePerms = this.permissionGroups[module].map((p: any) => p.name);
    modulePerms.forEach((perm: string) => {
      if (!this.selectedPermissions.includes(perm)) {
        this.selectedPermissions.push(perm);
      }
    });
  }

  deselectAllInGroup(module: string): void {
    const modulePerms = this.permissionGroups[module].map((p: any) => p.name);
    this.selectedPermissions = this.selectedPermissions.filter(
      perm => !modulePerms.includes(perm)
    );
  }

  validateForm(): boolean {
    if (!this.name.trim()) {
      this.errorMessage = 'Role name is required';
      return false;
    }

    if (!this.description.trim()) {
      this.errorMessage = 'Description is required';
      return false;
    }

    if (this.selectedPermissions.length === 0) {
      this.errorMessage = 'Select at least one permission';
      return false;
    }

    return true;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    const roleData = {
      name: this.name,
      description: this.description,
      permissions: this.selectedPermissions
    };

    if (this.isEditMode && this.roleId) {
      this.updateRole(roleData);
    } else {
      this.createRole(roleData);
    }
  }

  createRole(roleData: any): void {
    this.roleService.createRole(roleData).subscribe({
      next: (role) => {
        this.isSubmitting = false;
        this.successMessage = 'Role created successfully!';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard/roles']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.error || 'Failed to create role';
        console.error('Error:', error);
      }
    });
  }

  updateRole(roleData: any): void {
    if (!this.roleId) return;

    this.roleService.updateRole(this.roleId, roleData).subscribe({
      next: (role) => {
        this.isSubmitting = false;
        this.successMessage = 'Role updated successfully!';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard/roles']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.error || 'Failed to update role';
        console.error('Error:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/roles']);
  }

  getSelectedCount(): number {
    return this.selectedPermissions.length;
  }

  getTotalCount(): number {
    return this.allPermissions.length;
  }
}