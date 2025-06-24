import { RequestViewModel } from './request.viewmodel';

// Interface principal do projeto - espelha a ProjectViewModel do back-end
export interface Project {
  // Propriedades de identificação
  // ID?: number;
  GuidID?: string;
  
  // Propriedades do projeto
  Name: string;
  Description?: string;
  ShortDescription?: string;
  Technologies?: string;
  
  // URLs do projeto
  ProjectUrl?: string;
  DemoUrl?: string;
  RepositoryUrl?: string;
  
  // Imagens
  MainImage?: string;
  AdditionalImages?: string;
  
  // Configurações do projeto
  Status?: string;
  Category?: string;
  DisplayOrder: number;
  IsFeatured: boolean;
  
  // Datas
  StartDate?: Date;
  EndDate?: Date;
  
  // Relacionamentos
  UserID?: number;
  UserName?: string;
  
  // Propriedades de auditoria (somente para respostas)
  IsActive?: boolean;
  DateCreated?: Date;
  DateUpdated?: Date;
  UserCreated?: string;
  UserUpdated?: string;
}

// Interface para filtros de listagem - espelha ProjectFilterViewModel do back-end
export interface ProjectFilter {
  Name?: string;
  Category?: string;
  Status?: string;
  IsFeatured?: boolean;
  Page?: number;
  PageSize?: number;
  OrderBy?: string;
  OrderDirection?: string;
}

// Interface para estatísticas de projetos
export interface ProjectStats {
  Total: number;
  Active: number;
  Featured: number;
  ByStatus: { [key: string]: number };
  ByCategory: { [key: string]: number };
}

// Enums para status e categorias
export enum ProjectStatus {
  EmDesenvolvimento = 'Em Desenvolvimento',
  Concluido = 'Concluído',
  Pausado = 'Pausado',
  Arquivado = 'Arquivado',
  Planejado = 'Planejado'
}

export enum ProjectCategory {
  WebApplication = 'Web Application',
  MobileApp = 'Mobile App',
  DesktopApp = 'Desktop App',
  API = 'API',
  Library = 'Library',
  Game = 'Game',
  DataScience = 'Data Science',
  MachineLearning = 'Machine Learning',
  Other = 'Other'
}

// Funções utilitárias
export class ProjectUtils {
  /**
   * Converte string de tecnologias em array
   */
  static parseTechnologies(technologies?: string): string[] {
    if (!technologies) return [];
    try {
      return JSON.parse(technologies);
    } catch {
      return technologies.split(',').map(tech => tech.trim());
    }
  }

  /**
   * Converte array de tecnologias em string
   */
  static stringifyTechnologies(technologies?: string[]): string {
    if (!technologies || technologies.length === 0) return '';
    return JSON.stringify(technologies);
  }

  /**
   * Converte string de imagens adicionais em array
   */
  static parseAdditionalImages(images?: string): string[] {
    if (!images) return [];
    try {
      return JSON.parse(images);
    } catch {
      return images.split(',').map(img => img.trim());
    }
  }

  /**
   * Converte array de imagens em string
   */
  static stringifyAdditionalImages(images?: string[]): string {
    if (!images || images.length === 0) return '';
    return JSON.stringify(images);
  }

  /**
   * Obtém as tecnologias como array a partir do projeto
   */
  static getTechnologiesList(project: Project): string[] {
    return this.parseTechnologies(project.Technologies);
  }

  /**
   * Obtém as imagens adicionais como array a partir do projeto
   */
  static getAdditionalImagesList(project: Project): string[] {
    return this.parseAdditionalImages(project.AdditionalImages);
  }

  /**
   * Converte data para formato de input date (YYYY-MM-DD)
   * 
   * @example
   * // Data vinda do JSON: "2024-01-15T10:30:00Z" ou new Date()
   * // Resultado: "2024-01-15"
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
   * 
   * @example
   * // Input do formulário: "2024-01-15"
   * // Resultado: Date object representing 2024-01-15T00:00:00
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
   * Prepara projeto para exibição no formulário (converte datas)
   */
  static prepareProjectForForm(project: Project): any {
    return {
      ...project,
      StartDate: this.formatDateForInput(project.StartDate),
      EndDate: this.formatDateForInput(project.EndDate)
    };
  }

  /**
   * Prepara dados do formulário para envio (converte datas de volta)
   */
  static prepareProjectForSave(formData: any): Project {
    return {
      ...formData,
      StartDate: this.parseInputDate(formData.StartDate),
      EndDate: this.parseInputDate(formData.EndDate)
    };
  }
} 