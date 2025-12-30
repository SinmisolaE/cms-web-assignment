import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginCredentials, AuthResponse, RegisterData, User } from '../models/auth';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Observable for current user (for components to subscribe to)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  // ========== AUTHENTICATION METHODS ==========

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/`, credentials)
      .pipe(
        map(response => {
          if (response.success && response.tokens) {
            this.storeAuthData(response);
          }
          return response;
        })
      );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    }
    
    this.clearAuthData();
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/refresh-token`,
      { refreshToken }
    ).pipe(
      map(tokens => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return tokens;
      })
    );
  }

  // ========== USER METHODS ==========

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  }

  // ========== PERMISSION METHODS ==========

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.permissions.includes(permission) : false;
  }

  hasAnyPermission(permissions: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  }

  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === roleName : false;
  }

  getUserPermissions(): string[] {
    const user = this.getCurrentUser();
    return user ? user.permissions : [];
  }

  // ========== HELPER METHODS ==========

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        console.log('User loaded successfully:', user); // Debug
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.clearAuthData();
      }
    }
  }

  private storeAuthData(response: AuthResponse): void {
    // Store tokens
    localStorage.setItem('accessToken', response.tokens.accessToken);
    localStorage.setItem('refreshToken', response.tokens.refreshToken);
    
    // Store user data
    const user: User = {
      id: response.user.id,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      email: response.user.email,
      role: response.user.role,
      permissions: response.user.permissions
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    
    try {
      // Decode JWT token (without using external library)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // ========== UTILITY METHODS ==========

  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (!user?.firstName || !user?.lastName) return 'U';
    return `${user.firstName} ${user.lastName}`;
  }

  updateUserProfile(updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, updates)
      .pipe(
        map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  // Check if user can perform action based on permissions
  canPerformAction(requiredPermissions: string[]): boolean {
    if (requiredPermissions.length === 0) return true;
    return this.hasAnyPermission(requiredPermissions);
  }
}