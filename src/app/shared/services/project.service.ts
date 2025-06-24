import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Project, 
  ProjectFilter, 
  ProjectStats,
} from '../../models/project.model';
import { RequestViewModel } from 'src/app/models/request.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private apiService: ApiService) { }

  /**
   * Obter todos os projetos com filtros e paginação
   */
  getProjects(filters?: ProjectFilter): Observable<RequestViewModel<Project>> {
    const params = this.buildQueryParams(filters);
    return this.apiService.get<RequestViewModel<Project>>('Projects', params);
  }

  /**
   * Obter projeto por ID
   */
  getProjectById(id: number): Observable<RequestViewModel<Project>> {
    return this.apiService.get<RequestViewModel<Project>>(`Projects/${id}`);
  }

  /**
   * Obter projeto por GUID
   */
  getProjectByGuid(guid: string): Observable<RequestViewModel<Project>> {
    return this.apiService.get<RequestViewModel<Project>>(`Projects/guid/${guid}`);
  }

  /**
   * Obter projetos em destaque
   */
  getFeaturedProjects(limit?: number): Observable<RequestViewModel<Project>> {
    const params = limit ? `?limit=${limit}` : '';
    return this.apiService.get<RequestViewModel<Project>>(`Projects/featured${params}`);
  }

  /**
   * Obter projetos por categoria
   */
  getProjectsByCategory(category: string): Observable<RequestViewModel<Project>> {
    return this.apiService.get<RequestViewModel<Project>>(`Projects/category/${category}`);
  }

  /**
   * Obter categorias disponíveis
   */
  getCategories(): Observable<RequestViewModel<string>> {
    return this.apiService.get<RequestViewModel<string>>('Projects/categories');
  }

  /**
   * Obter tecnologias disponíveis
   */
  getTechnologies(): Observable<RequestViewModel<string>> {
    return this.apiService.get<RequestViewModel<string>>('Projects/technologies');
  }

  /**
   * Obter estatísticas dos projetos
   */
  getProjectStats(): Observable<RequestViewModel<ProjectStats>> {
    return this.apiService.get<RequestViewModel<ProjectStats>>('Projects/stats');
  }

  /**
   * Criar novo projeto
   */
  createProject(project: Omit<Project, 'ID' | 'UserID'>): Observable<RequestViewModel<Project>> {
    return this.apiService.post<RequestViewModel<Project>>('Projects', project);
  }

  /**
   * Atualizar projeto existente
   */
  updateProject(project: Project): Observable<RequestViewModel<Project>> {
    if (!project.GuidID) {
      throw new Error('ID do projeto é obrigatório para atualização');
    }
    return this.apiService.put<RequestViewModel<Project>>(`Projects/${project.GuidID}`, project);
  }

  /**
   * Ativar/Desativar projeto
   */
  toggleProjectStatus(id: number): Observable<RequestViewModel<Project>> {
    return this.apiService.patch<RequestViewModel<Project>>(`Projects/${id}/toggle-status`, {});
  }

  /**
   * Excluir projeto
   */
  deleteProject(id: string): Observable<RequestViewModel<Project>> {
    return this.apiService.delete<RequestViewModel<Project>>(`Projects/${id}`);
  }

  /**
   * Obter lista simples de projetos
   */
  getProjectsList(filters?: ProjectFilter): Observable<Project[]> {
    return this.getProjects(filters).pipe(
      map(response => response.Data)
    );
  }

  /**
   * Obter projetos em destaque como lista simples
   */
  getFeaturedProjectsList(limit?: number): Observable<Project[]> {
    return this.getFeaturedProjects(limit).pipe(
      map(response => response.Data)
    );
  }

  /**
   * Obter projeto completo por ID
   */
  getProject(id: number): Observable<Project> {
    return this.getProjectById(id).pipe(
      map(response => {
        if (response.Data && response.Data.length > 0) {
          return response.Data[0];
        }
        throw new Error('Projeto não encontrado');
      })
    );
  }

  /**
   * Obter lista simples de categorias
   */
  getCategoriesList(): Observable<string[]> {
    return this.getCategories().pipe(
      map(response => response.Data)
    );
  }

  /**
   * Obter lista simples de tecnologias
   */
  getTechnologiesList(): Observable<string[]> {
    return this.getTechnologies().pipe(
      map(response => response.Data)
    );
  }

  /**
   * Obter estatísticas simples
   */
  getProjectStatsData(): Observable<ProjectStats> {
    return this.getProjectStats().pipe(
      map(response => {
        if (response.Data && response.Data.length > 0) {
          return response.Data[0];
        }
        throw new Error('Estatísticas não encontradas');
      })
    );
  }

  /**
   * Validar se um projeto é válido para criação
   */
  validateForCreate(project: Project): string[] {
    const errors: string[] = [];
    
    if (!project.Name || project.Name.trim().length === 0) {
      errors.push('Nome do projeto é obrigatório');
    }
    
    if (project.Name && project.Name.length > 200) {
      errors.push('Nome deve ter no máximo 200 caracteres');
    }
    
    if (project.Description && project.Description.length > 2000) {
      errors.push('Descrição deve ter no máximo 2000 caracteres');
    }
    
    return errors;
  }

  /**
   * Validar se um projeto é válido para atualização
   */
  validateForUpdate(project: Project): string[] {
    const errors = this.validateForCreate(project);
    
    if (!project.GuidID) {
      errors.push('ID do projeto é obrigatório para atualização');
    }
    
    return errors;
  }

  /**
   * Construir parâmetros de query para filtros
   */
  private buildQueryParams(filters?: ProjectFilter): any {
    if (!filters) return {};
    
    const params: any = {};
    
    if (filters.Page) params.Page = filters.Page;
    if (filters.PageSize) params.PageSize = filters.PageSize;
    if (filters.Name) params.Name = filters.Name;
    if (filters.Category) params.Category = filters.Category;
    if (filters.Status) params.Status = filters.Status;
    if (filters.IsFeatured !== undefined) params.IsFeatured = filters.IsFeatured;
    if (filters.OrderBy) params.OrderBy = filters.OrderBy;
    if (filters.OrderDirection) params.OrderDirection = filters.OrderDirection;
    
    return params;
  }
} 