import { RequestViewModel } from './request.viewmodel';

export interface User {
  GuidID: string;
  Name: string;
  Email: string;
  Password: string;
  Role: string;
  Token: string;
}

export interface UserAuthenticateRequest {
  Email: string;
  Password: string;
}

export interface UserCreateRequest {
  Name: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  Bio?: string;
  Location?: string;
  Phone?: string;
}

export interface UserUpdateRequest {
  ID: number;
  Name: string;
  Bio?: string;
  Location?: string;
  Phone?: string;
  ProfileImage?: string;
  LinkedInUrl?: string;
  GitHubUrl?: string;
  PortfolioUrl?: string;
}

export interface UserChangePasswordRequest {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface UserResetPasswordRequest {
  Email: string;
}

export interface UserFilter {
  Name?: string;
  Email?: string;
  IsActive?: boolean;
  IsAdmin?: boolean;
  Page?: number;
  PageSize?: number;
  OrderBy?: string;
  OrderDirection?: string;
}

export interface UserStats {
  Total: number;
  Active: number;
  Admins: number;
  EmailConfirmed: number;
  RecentLogins: number;
}

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Moderator = 'Moderator'
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Banned = 'Banned',
  Pending = 'Pending'
}

export class UserUtils {
  static isAdmin(user?: User): boolean {
    return user?.Role === 'Admin' || false;
  }





  static getDisplayName(user?: User): string {
    if (!user) return 'Usuário';
    return user.Name || user.Email || 'Usuário';
  }

  static getInitials(user?: User): string {
    if (!user?.Name) return 'U';
    
    const names = user.Name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.Name[0].toUpperCase();
  }

  static isTokenExpiringSoon(user?: User, minutesThreshold: number = 30): boolean {
    if (!user?.Token) return false;
    
    const expirationTime = new Date(user.Token).getTime();
    const currentTime = Date.now();
    const threshold = minutesThreshold * 60 * 1000;
    
    return (expirationTime - currentTime) <= threshold;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push('Senha deve ter pelo menos 8 caracteres');
    }

    if (/[a-z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('Senha deve conter letras minúsculas');
    }

    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('Senha deve conter letras maiúsculas');
    }

    if (/\d/.test(password)) {
      score += 25;
    } else {
      feedback.push('Senha deve conter números');
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 10;
    } else {
      feedback.push('Senha deve conter caracteres especiais');
    }

    return {
      isValid: score >= 75,
      score: Math.min(score, 100),
      feedback
    };
  }

  static sanitizeForDisplay(user: User): Partial<User> {
    const { Password, Token, ...safeUser } = user;
    return safeUser;
  }

  static isProfileComplete(user?: User): boolean {
    if (!user) return false;
    
    const requiredFields = ['Name', 'Email'];
    const optionalFields = ['Bio', 'Location', 'Phone'];
    
    const hasRequired = requiredFields.every(field => 
      user[field as keyof User] && (user[field as keyof User] as string).trim().length > 0
    );
    
    const hasOptional = optionalFields.some(field => 
      user[field as keyof User] && (user[field as keyof User] as string).trim().length > 0
    );
    
    return hasRequired && hasOptional;
  }

  static getProfileProgress(user?: User): number {
    if (!user) return 0;
    
    const fields = [
      'Name', 'Email', 'Bio', 'Location', 'Phone', 
      'ProfileImage', 'LinkedInUrl', 'GitHubUrl'
    ];
    
    const completedFields = fields.filter(field => {
      const value = user[field as keyof User];
      return value && (value as string).trim().length > 0;
    });
    
    return Math.round((completedFields.length / fields.length) * 100);
  }
} 