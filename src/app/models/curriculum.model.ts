/**
 * Interface para informações pessoais
 */
export interface PersonalInfo {
  GuidID?: string;
  Name: string;
  Title: string;
  Description?: string;
  Location?: string;
  Phone?: string;
  Email?: string;
  ProfileImage?: string;
  YearsExperience: number;
  ProjectsCompleted: number;
  HappyClients: number;
  Certifications: number;
  LinkedInUrl?: string;
  GitHubUrl?: string;
  PortfolioUrl?: string;
  IsActive?: boolean;
  UserID?: number;
  DateCreated?: Date;
  DateUpdated?: Date;
}

/**
 * Interface para habilidades técnicas
 */
export interface Skill {
  ID?: number;
  GuidID?: string;
  Name: string;
  Level: number;
  Category: string;
  DisplayOrder?: number;
  IsActive?: boolean;
  UserID?: number;
  Icon?: string;
  Color?: string;
  DateCreated?: Date;
  DateUpdated?: Date;
}

/**
 * Interface para experiências profissionais
 */
export interface Experience {
  ID?: number;
  GuidID?: string;
  Title: string;
  Company: string;
  StartDate: Date;
  EndDate?: Date;
  Location?: string;
  Description?: string;
  /**
   * JSON array como string
   */
  Responsibilities?: string;
  /**
   * JSON array como string
   */
  Technologies?: string;
  /**
   * JSON array como string
   */
  Achievements?: string;
  IsCurrentJob: boolean;
  DisplayOrder?: number;
  IsActive?: boolean;
  UserID?: number;
  DateCreated?: Date;
  DateUpdated?: Date;
}

/**
 * Interface para educação
 */
export interface Education {
  ID?: number;
  GuidID?: string;
  Degree: string;
  Institution: string;
  StartDate: Date;
  EndDate?: Date;
  Location?: string;
  Description?: string;
  Grade?: string;
  /**
   * JSON array como string
   */
  Achievements?: string;
  IsActive?: boolean;
  UserID?: number;
  DisplayOrder?: number;
  DateCreated?: Date;
  DateUpdated?: Date;
}

/**
 * Interface para certificações
 */
export interface Certification {
  ID?: number;
  GuidID?: string;
  Name: string;
  Issuer: string;
  IssueDate: Date;
  ExpiryDate?: Date;
  CredentialId?: string;
  CredentialUrl?: string;
  Description?: string;
  IsActive?: boolean;
  UserID?: number;
  DisplayOrder?: number;
  DateCreated?: Date;
  DateUpdated?: Date;
}

/**
 * Interface para serviços oferecidos
 */
export interface Service {
  ID?: number;
  GuidID?: string;
  Title: string;
  Description?: string;
  Icon?: string;
  /**
   * JSON array como string
   */
  Features?: string;
  Price?: number;
  Currency?: string;
  Duration?: string;
  IsActive?: boolean;
  UserID?: number;
  DisplayOrder?: number;
  DateCreated?: Date;
  DateUpdated?: Date;
}

/**
 * Enums para categorias de habilidades
 */
export enum SkillCategory {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Database = 'Database',
  Tools = 'Tools',
  Mobile = 'Mobile',
  DevOps = 'DevOps',
  Other = 'Other'
}

/**
 * Enums para tipos de experiência
 */
export enum ExperienceType {
  FullTime = 'Full-Time',
  PartTime = 'Part-Time',
  Contract = 'Contract',
  Freelance = 'Freelance',
  Internship = 'Internship'
}

/**
 * Interface para currículo completo
 */
export interface CurriculumData {
  PersonalInfo: PersonalInfo;
  Skills: Skill[];
  Experiences: Experience[];
  Education: Education[];
  Certifications: Certification[];
  Services: Service[];
}

/**
 * Funções utilitárias
 */
export class CurriculumUtils {
  /**
   * Formatar período de experiência/educação
   */
  static formatPeriod(startDate: Date, endDate?: Date): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: 'numeric' 
      });
    };

    const startStr = formatDate(start);
    const endStr = end ? formatDate(end) : 'Presente';
    
    return `${startStr} - ${endStr}`;
  }

  /**
   * Calcular duração em meses
   */
  static calculateDurationInMonths(startDate: Date, endDate?: Date): number {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    return Math.max(0, months);
  }

  /**
   * Formatar duração em texto
   */
  static formatDuration(startDate: Date, endDate?: Date): string {
    const months = this.calculateDurationInMonths(startDate, endDate);
    
    if (months < 12) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
    
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
  }

  /**
   * Obter classe CSS para nível de habilidade
   */
  static getSkillLevelClass(level: number): string {
    if (level >= 90) return 'expert';
    if (level >= 75) return 'advanced';
    if (level >= 50) return 'intermediate';
    return 'beginner';
  }

  /**
   * Obter texto para nível de habilidade
   */
  static getSkillLevelText(level: number): string {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Avançado';
    if (level >= 50) return 'Intermediário';
    return 'Iniciante';
  }

  /**
   * Converter string JSON em array
   */
  static parseStringArray(jsonString?: string): string[] {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch {
      return jsonString.split(',').map(item => item.trim());
    }
  }

  /**
   * Converter array em string JSON
   */
  static stringifyArray(array?: string[]): string {
    if (!array || array.length === 0) return '';
    return JSON.stringify(array);
  }

  /**
   * Converte data para formato de input date (YYYY-MM-DD)
   */
  static formatDateForInput(date?: Date | string): string {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Verifica se a data é válida
      if (isNaN(dateObj.getTime())) return '';
      
      // Retorna no formato YYYY-MM-DD
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  }

  /**
   * Converte string de input date (YYYY-MM-DD) para objeto Date
   */
  static parseInputDate(dateString?: string): Date | undefined {
    if (!dateString) return undefined;
    
    try {
      const date = new Date(dateString + 'T00:00:00');
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  }

  /**
   * Prepara item de currículo para exibição no formulário (converte datas)
   */
  static prepareCurriculumItemForForm(item: any): any {
    const result = { ...item };
    
    // Converte datas específicas baseadas no tipo do item
    if (item.StartDate) result.StartDate = this.formatDateForInput(item.StartDate);
    if (item.EndDate) result.EndDate = this.formatDateForInput(item.EndDate);
    if (item.IssueDate) result.IssueDate = this.formatDateForInput(item.IssueDate);
    if (item.ExpiryDate) result.ExpiryDate = this.formatDateForInput(item.ExpiryDate);
    
    return result;
  }

  /**
   * Prepara dados do formulário para envio (converte datas de volta)
   */
  static prepareCurriculumItemForSave(formData: any): any {
    const result = { ...formData };
    
    // Converte datas de volta para objetos Date
    if (formData.StartDate) result.StartDate = this.parseInputDate(formData.StartDate);
    if (formData.EndDate) result.EndDate = this.parseInputDate(formData.EndDate);
    if (formData.IssueDate) result.IssueDate = this.parseInputDate(formData.IssueDate);
    if (formData.ExpiryDate) result.ExpiryDate = this.parseInputDate(formData.ExpiryDate);
    
    return result;
  }
} 