export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    firstName: string;
    lastName: string;
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: string;
}

export interface RegisterFormData extends RegisterData {
  confirmPassword: string; // Only for frontend validation
}

export interface RoleOption {
  name: string;
  description: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
}