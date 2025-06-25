import { Component, OnInit } from '@angular/core';
import { Project, ProjectFilter, ProjectUtils, ProjectCategory, ProjectStatus } from '../../models/project.model';
import { ProjectService } from '../../shared/services/project.service';
import { LoadingService } from '../../shared/services/loading.service';

interface CategoryOption {
  key: string;
  label: string;
  count: number;
}

interface StatusOption {
  key: string;
  label: string;
  count: number;
}

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
    standalone: false
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedProject: Project | null = null;
  loading = false;
  error = '';
  
  // Filtros
  selectedCategory: string = '';
  selectedStatus: string = '';
  availableCategories: CategoryOption[] = [];
  availableStatuses: StatusOption[] = [];
  
  filters: ProjectFilter = {
    Page: 1,
    PageSize: 50 // Aumentamos para pegar mais projetos de uma vez
  };

  // Imagens de fallback
  private readonly fallbackImages = [
    'assets/img/portfolio/portfolio-1.jpg',
    'assets/img/portfolio/portfolio-2.jpg',
    'assets/img/portfolio/portfolio-3.jpg',
    'assets/img/portfolio/portfolio-4.jpg',
    'assets/img/portfolio/portfolio-5.jpg'
  ];

  constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  /**
   * Carregar projetos da API
   */
  loadProjects(): void {
    this.loading = true;
    this.error = '';

    this.projectService.getProjectsList(this.filters).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = [...projects];
        this.updateFilterOptions();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar projetos: ' + error.message;
        this.loading = false;
      }
    });
  }

  /**
   * Atualizar opções de filtro baseadas nos projetos carregados
   */
  private updateFilterOptions(): void {
    // Atualizar categorias
    const categoryCount: { [key: string]: number } = {};
    this.projects.forEach(project => {
      if (project.Category) {
        categoryCount[project.Category] = (categoryCount[project.Category] || 0) + 1;
      }
    });

    this.availableCategories = Object.keys(categoryCount).map(key => ({
      key,
      label: this.getCategoryLabel(key),
      count: categoryCount[key]
    })).sort((a, b) => a.label.localeCompare(b.label));

    // Atualizar status
    const statusCount: { [key: string]: number } = {};
    this.projects.forEach(project => {
      if (project.Status) {
        statusCount[project.Status] = (statusCount[project.Status] || 0) + 1;
      }
    });

    this.availableStatuses = Object.keys(statusCount).map(key => ({
      key,
      label: this.getStatusLabel(key),
      count: statusCount[key]
    })).sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * Filtrar por categoria
   */
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyLocalFilters();
  }

  /**
   * Filtrar por status
   */
  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyLocalFilters();
  }

  /**
   * Aplicar filtros combinados
   */
  private applyLocalFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      const categoryMatch = !this.selectedCategory || project.Category === this.selectedCategory;
      const statusMatch = !this.selectedStatus || project.Status === this.selectedStatus;
      return categoryMatch && statusMatch;
    });
  }

  /**
   * Limpar todos os filtros
   */
  clearAllFilters(): void {
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.filteredProjects = [...this.projects];
  }

  /**
   * Obter total de projetos
   */
  getTotalProjectsCount(): number {
    return this.projects.length;
  }

  /**
   * Obter label da categoria
   */
  getCategoryLabel(category: string): string {
    const categoryLabels: { [key: string]: string } = {
      'Web Application': 'Aplicação Web',
      'Mobile App': 'App Mobile',
      'Desktop App': 'App Desktop',
      'API': 'API',
      'Library': 'Biblioteca',
      'Game': 'Jogo',
      'Data Science': 'Ciência de Dados',
      'Machine Learning': 'Machine Learning',
      'Other': 'Outros'
    };
    return categoryLabels[category] || category;
  }

  /**
   * Obter label do status
   */
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'Em Desenvolvimento': 'Em Desenvolvimento',
      'Concluído': 'Concluído',
      'Pausado': 'Pausado',
      'Arquivado': 'Arquivado',
      'Planejado': 'Planejado'
    };
    return statusLabels[status] || status;
  }

  /**
   * Obter classe CSS do status
   */
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Concluído': 'status-completed',
      'Em Desenvolvimento': 'status-development',
      'Pausado': 'status-paused',
      'Arquivado': 'status-archived',
      'Planejado': 'status-planned'
    };
    return statusClasses[status] || 'status-default';
  }

  /**
   * Aplicar filtros (método original mantido para compatibilidade)
   */
  applyFilters(newFilters: ProjectFilter): void {
    this.filters = { ...this.filters, ...newFilters, Page: 1 };
    this.loadProjects();
  }

  /**
   * Limpar filtros (método original mantido para compatibilidade)
   */
  clearFilters(): void {
    this.filters = {
      Page: 1,
      PageSize: 50
    };
    this.loadProjects();
  }

  /**
   * Carregar mais projetos
   */
  loadMore(): void {
    if (this.filters.Page) {
      this.filters.Page++;
      this.loading = true;
      
      this.projectService.getProjectsList(this.filters).subscribe({
        next: (newProjects) => {
          this.projects = [...this.projects, ...newProjects];
          this.filteredProjects = [...this.filteredProjects, ...newProjects];
          this.updateFilterOptions();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar mais projetos: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  /**
   * Selecionar projeto para o modal
   */
  selectProject(project: Project) {
    this.selectedProject = project;
  }

  /**
   * Limpar seleção de projeto (quando modal é fechado)
   */
  closeProjectDetails(): void {
    this.selectedProject = null;
  }

  /**
   * Obter tecnologias do projeto
   */
  getProjectTechnologies(project: Project): string[] {
    return ProjectUtils.getTechnologiesList(project);
  }

  /**
   * Obter imagem principal do projeto com fallback melhorado
   */
  getProjectImage(project: Project): string {
    if (project.MainImage && project.MainImage.trim()) {
      return project.MainImage;
    }
    
    // Usar hash do nome do projeto para escolher uma imagem consistente
    const hash = this.hashCode(project.Name || '');
    const index = Math.abs(hash) % this.fallbackImages.length;
    return this.fallbackImages[index];
  }

  /**
   * Tratamento de erro de imagem
   */
  onImageError(event: any, project: Project): void {
    const img = event.target;
    const currentSrc = img.src;
    
    // Se já estamos usando uma imagem de fallback, não fazer nada
    if (this.fallbackImages.some(fallback => currentSrc.includes(fallback))) {
      return;
    }
    
    // Usar uma imagem de fallback diferente
    const hash = this.hashCode(project.Name || '' + currentSrc);
    const index = Math.abs(hash) % this.fallbackImages.length;
    img.src = this.fallbackImages[index];
  }

  /**
   * Função hash simples para consistência
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Obter URL do projeto
   */
  openProjectUrl(project: Project) {
    if (project.ProjectUrl) {
      window.open(project.ProjectUrl, '_blank');
    }
  }

  /**
   * Obter URL da demo
   */
  openDemoUrl(project: Project) {
    if (project.DemoUrl) {
      window.open(project.DemoUrl, '_blank');
    }
  }

  /**
   * Obter URL do repositório
   */
  openRepositoryUrl(project: Project) {
    if (project.RepositoryUrl) {
      window.open(project.RepositoryUrl, '_blank');
    }
  }
}
