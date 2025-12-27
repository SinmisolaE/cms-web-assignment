export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    permissions: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}