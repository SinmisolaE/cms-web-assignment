import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register')
      .then(m => m.RegisterComponent)
  },
  {
    path: '',  // Default route
    redirectTo: '/login',
    pathMatch: 'full'
  },
   {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard/dashboard')
      .then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'articles/all',
        pathMatch: 'full'
      },
      {
        path: 'articles',
        redirectTo: 'articles/all',
        pathMatch: 'full'
      },
      {
        path: 'articles/all',
        canActivate: [roleGuard(['view_all_articles'])],
        loadComponent: () => import('./components/articles/article-list/article-list')
          .then(m => m.ArticleListComponent),
        data: { mode: 'all' }
      },
      {
        path: 'articles/published',
        canActivate: [roleGuard(['view_published_only'])],
        loadComponent: () => import('./components/articles/article-list/article-list')
          .then(m => m.ArticleListComponent),
        data: { mode: 'published' }
      },
      {
        path: 'articles/create',
        canActivate: [roleGuard(['create_article'])],
        loadComponent: () => import('./components/articles/article-form/article-form')
          .then(m => m.ArticleFormComponent)
      },
      {
        path: 'articles/:id/edit',
        canActivate: [roleGuard(['edit_article'])],
        loadComponent: () => import('./components/articles/article-form/article-form')
          .then(m => m.ArticleFormComponent)
      },
      {
      path: 'articles/:id',
      loadComponent: () => import('./components/articles/article-detail/article-detail')
        .then(m => m.ArticleDetailComponent)
    },
      {
        path: 'roles',
        canActivate: [roleGuard(['view_roles'])],
        loadComponent: () => import('./components/roles/role-list/role-list')
          .then(m => m.RoleListComponent)
      },
      {
        path: 'roles/create',
        canActivate: [roleGuard(['create_role'])],
        loadComponent: () => import('./components/roles/role-form/role-form')
          .then(m => m.RoleFormComponent)
      },
      {
        path: 'roles/:id/edit',
        canActivate: [roleGuard(['edit_role'])],
        loadComponent: () => import('./components/roles/role-form/role-form')
          .then(m => m.RoleFormComponent)
      },
      
      {
        path: 'users',
        canActivate: [roleGuard(['view_users'])],
        loadComponent: () => import('./components/users/user-list/user-list')
          .then(m => m.UserListComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./components/profile/profile')
          .then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: '**',  // Catch all unknown routes
    redirectTo: '/login'
  }
];