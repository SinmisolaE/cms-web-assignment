export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemDefault: boolean;
  createdBy?: {
    _id: string;
    fullName: string;
  };
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleResponse {
  success: boolean;
  roles: Role[];
  count: number;
}

export interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

export interface Permission {
  name: string;
  label: string;
  description: string;
}