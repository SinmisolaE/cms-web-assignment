import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, RoleResponse, CreateRoleDto, UpdateRoleDto } from '../models/role.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  // Get all roles
  getAllRoles(): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.apiUrl}/`);
  }

  // Get role by ID
  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  // Create new role
  createRole(roleData: CreateRoleDto): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/add`, roleData);
  }

  // Update role
  updateRole(id: string, roleData: UpdateRoleDto): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, roleData);
  }

  // Delete role
  deleteRole(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // Get access matrix (which role has which permissions)
  getAccessMatrix(): Observable<any> {
    return this.http.get(`${this.apiUrl}/matrix`);
  }
}