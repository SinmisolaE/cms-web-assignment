import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    _id: string;
    name: string;
    permissions: string[];
  };
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/`);
  }

  // Get users by role
  getUsersByRole(role: string): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/${role}`);
  }

  // Delete user
  deleteUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
