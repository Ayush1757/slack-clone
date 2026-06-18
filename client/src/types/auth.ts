export interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}
