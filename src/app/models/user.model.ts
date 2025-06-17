/**
 * Interface para dados do usuário
 */
export interface User {
  GuidID: string;
  Name: string;
  Email: string;
  Password: string;
  Role: string;
  Token: string;
}

/**
 * Interface para dados de autenticação do usuário
 */
export interface UserAuthenticateRequest {
  Email: string;
  Password: string;
}

