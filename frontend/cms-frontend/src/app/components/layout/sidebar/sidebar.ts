import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { MenuItem } from '../../../models/dashboard';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  // Menu items based on permissions
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/dashboard',
      requiredPermissions: ['view_dashboard']
    },
    {
      label: 'Articles',
      icon: 'bi-newspaper',
      route: '/dashboard/articles',
      requiredPermissions: ['view_all_articles'],
      children: [
        {
          label: 'All Articles',
          icon: 'bi-list',
          route: '/dashboard/articles/all',
          requiredPermissions: ['view_all_articles']
        },
        {
          label: 'Published Articles',
          icon: 'bi-check-circle',
          route: '/dashboard/articles/published',
          requiredPermissions: ['view_published_only']
        },
        {
          label: 'Create Article',
          icon: 'bi-plus-circle',
          route: '/dashboard/articles/create',
          requiredPermissions: ['create_article']
        }
      ]
    },
    {
      label: 'Roles & Permissions',
      icon: ' bi-shield-lock',
      route: '/dashboard/roles',
      requiredPermissions: ['view_roles'],
      children: [
        {
          label: 'Access Matrix',
          icon: 'bi-people',
          route: '/dashboard/roles',
          requiredPermissions: ['view_roles']
        },
        {
          label: 'Create Role',
          icon: 'bi-plus-circle',
          route: '/dashboard/roles/create',
          requiredPermissions: ['create_role']
        }
      ]
    },
    {
      label: 'Users',
      icon: 'bi-people',
      route: '/dashboard/users',
      requiredPermissions: ['view_users']
    },
    {
      label: 'Profile',
      icon: 'bi-person',
      route: '/dashboard/profile',
      requiredPermissions: [] // Everyone can access profile
    }
  ];

  constructor(private authService: AuthService) {}

  // Convert label to safe ID for HTML elements
  getLabelAsId(label: string): string {
    return label.replace(/\s+/g, '-').toLowerCase();
  }

  // Check if user can see menu item
  canShowMenuItem(item: MenuItem): boolean {
    if (item.requiredPermissions.length === 0) return true;
    return this.authService.hasAnyPermission(item.requiredPermissions);
  }

  // Get user info
  getUserInfo() {
    return this.authService.getCurrentUser();
  }
}