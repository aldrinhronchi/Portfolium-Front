export interface User {
  ID: number;
  Name: string;
  Email: string;
  Password?: string;
}

export interface UserAuthenticateRequest {
  Email: string;
  Password: string;
}

export interface UserAuthenticateResponse {
  success: boolean;
  message: string;
  Token: string;
  User: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
} 