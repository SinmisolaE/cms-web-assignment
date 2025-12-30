import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard = (requiredPermissions: string[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (!authService.hasAnyPermission(requiredPermissions)) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
};