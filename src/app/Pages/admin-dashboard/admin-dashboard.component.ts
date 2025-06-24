import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { 
  Project, 
  ProjectFilter, 
  ProjectStatus, 
  ProjectCategory,
  ProjectUtils 
} from '../../models/project.model';
import {
  PersonalInfo,
  Skill,
  Experience,
  Education,
  Certification,
  Service,
  SkillCategory
} from '../../models/curriculum.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CurriculumService } from 'src/app/shared/services/curriculum.service';
import { ProjectService } from 'src/app/shared/services/project.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {

  // Estados gerais
  error = '';
  successMessage = '';

  // Aba ativa
  activeTab: 'projects' | 'curriculum' = 'projects';

  // Projetos
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedProject: Project | null = null;
  
  // Filtros e paginação
  filters: ProjectFilter = {
    Page: 1,
    PageSize: 10,
    OrderBy: 'DateCreated',
    OrderDirection: 'DESC'
  };
  
  totalProjects = 0;
  totalPages = 0;

  // Modais e formulários
  showProjectModal = false;
  showDeleteModal = false;
  isEditMode = false;
  isViewMode = false;

  // Enums para templates
  projectStatuses = Object.values(ProjectStatus);
  projectCategories = Object.values(ProjectCategory);

  // Estatísticas
  stats = {
    total: 0,
    active: 0,
    featured: 0,
    byStatus: {} as { [key: string]: number },
    byCategory: {} as { [key: string]: number }
  };

  // ===== CURRICULUM MANAGEMENT =====
  
  // Dados do currículo
  personalInfo: PersonalInfo | null = null;
  skills: Skill[] = [];
  experiences: Experience[] = [];
  education: Education[] = [];
  certifications: Certification[] = [];
  services: Service[] = [];

  // Modais e formulários do currículo
  showCurriculumModal = false;
  curriculumModalType: 'personal' | 'skill' | 'experience' | 'education' | 'certification' | 'service' = 'personal';
  selectedCurriculumItem: any = null;
  curriculumForm!: FormGroup;
  isEditCurriculumMode = false;

  // Enums para currículo
  skillCategories = Object.values(SkillCategory);

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private curriculumService: CurriculumService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.initializeCurriculumForm();
  }

  ngOnInit() {
    this.checkAuthentication();
    this.loadProjects();
    this.loadStats();
    this.loadCurriculumData();
  }

  /**
   * Verificar autenticação
   */
  checkAuthentication() {
    if (!this.authService.isAuthenticated() || this.authService.isTokenExpired()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  /**
   * Alternar aba ativa
   */
  setActiveTab(tab: 'projects' | 'curriculum') {
    this.activeTab = tab;
    this.clearMessages();
  }

  /**
   * Carregar projetos
   */
  loadProjects() {
    this.error = '';

    this.projectService.getProjects(this.filters).subscribe({
      next: (response) => {
        this.projects = response.Data || [];
        this.filteredProjects = [...this.projects];
        this.totalProjects = response.PageCount || 0;
        this.totalPages = Math.ceil(this.totalProjects / (this.filters.PageSize || 10));
      }
    });
  }

  /**
   * Carregar estatísticas
   */
  loadStats() {
    this.projectService.getProjectStatsData().subscribe({
      next: (stats) => {
        if (stats) {
          this.stats = {
            total: stats.Total || 0,
            active: stats.Active || 0,
            featured: stats.Featured || 0,
            byStatus: stats.ByStatus || {},
            byCategory: stats.ByCategory || {}
          };
          console.log('📊 Estatísticas carregadas:', this.stats);
          console.log('📂 Categorias:', this.stats.byCategory);
        }
      },
      error: (error) => {
        console.error('❌ Erro ao carregar estatísticas:', error);
        this.error = 'Erro ao carregar estatísticas';
      }
    });
  }

  /**
   * Filtrar projetos localmente
   */
  applyFilters() {
    let filtered = [...this.projects];

    // Filtro por nome
    if (this.filters.Name) {
      filtered = filtered.filter(p => 
        p.Name.toLowerCase().includes(this.filters.Name!.toLowerCase())
      );
    }

    // Filtro por categoria
    if (this.filters.Category) {
      filtered = filtered.filter(p => p.Category === this.filters.Category);
    }

    // Filtro por status
    if (this.filters.Status) {
      filtered = filtered.filter(p => p.Status === this.filters.Status);
    }

    // Filtro por destaque
    if (this.filters.IsFeatured !== undefined) {
      filtered = filtered.filter(p => p.IsFeatured === this.filters.IsFeatured);
    }

    this.filteredProjects = filtered;
  }

  /**
   * Limpar filtros
   */
  clearFilters() {
    this.filters = {
      Page: 1,
      PageSize: 10,
      OrderBy: 'DateCreated',
      OrderDirection: 'DESC'
    };
    this.applyFilters();
  }

  /**
   * Abrir modal para criar projeto
   */
  openCreateModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedProject = null;
    this.showProjectModal = true;
  }

  /**
   * Abrir modal para editar projeto
   */
  openEditModal(project: Project) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedProject = project;
    this.showProjectModal = true;
  }

  /**
   * Fechar modal de projeto
   */
  closeProjectModal() {
    this.showProjectModal = false;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedProject = null;
  }

  /**
   * Salvar projeto
   */
  saveProject(projectData?: Project) {
    if (!projectData) {
      console.error('Dados do projeto não fornecidos');
      return;
    }

    const operation = this.isEditMode 
      ? this.projectService.updateProject(projectData as Project)
      : this.projectService.createProject(projectData as Project);

    operation.subscribe({
      next: (response) => {
        this.successMessage = this.isEditMode 
          ? 'Projeto atualizado com sucesso!' 
          : 'Projeto criado com sucesso!';
        this.closeProjectModal();
        this.loadProjects();
        this.loadStats();
      }
    });
  }

  /**
   * Confirmar exclusão
   */
  confirmDelete(project: Project) {
    this.selectedProject = project;
    this.showDeleteModal = true;
  }

  /**
   * Excluir projeto
   */
  deleteProject() {
    if (!this.selectedProject) return;

    let projectId = this.selectedProject.GuidID ?? "";
    if (projectId === "") {
      this.error = 'Erro ao excluir projeto';
      return;
    }
    
    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.successMessage = 'Projeto excluído com sucesso!';
        this.showDeleteModal = false;
        this.selectedProject = null;
        this.loadProjects();
        this.loadStats();
      }
    });
  }

  /**
   * Alternar destaque
   */
  toggleFeatured(project: Project) {
    const updatedProject = { ...project, IsFeatured: !project.IsFeatured };
    
    this.projectService.updateProject(updatedProject).subscribe({
      next: () => {
        project.IsFeatured = !project.IsFeatured;
        this.loadStats();
      }
    });
  }

  /**
   * Alternar status ativo
   */
  toggleStatus(project: Project) {
    const updatedProject = { ...project, IsActive: !project.IsActive };
    
    this.projectService.updateProject(updatedProject).subscribe({
      next: () => {
        project.IsActive = !project.IsActive;
        this.loadStats();
      }
    });
  }

  /**
   * Mudar página
   */
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.Page = page;
      this.loadProjects();
    }
  }

  /**
   * Mudar tamanho da página
   */
  changePageSize(size: number) {
    this.filters.PageSize = size;
    this.filters.Page = 1;
    this.loadProjects();
  }

  /**
   * Limpar mensagens
   */
  private clearMessages() {
    this.error = '';
    this.successMessage = '';
  }

  /**
   * Logout
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /**
   * Visualizar projeto
   */
  viewProject(project: Project) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.selectedProject = project;
    this.showProjectModal = true;
  }

  /**
   * Obter ícone do status
   */
  getStatusIcon(status?: string): string {
    switch (status) {
      case ProjectStatus.Concluido: return 'fas fa-check-circle';
      case ProjectStatus.EmDesenvolvimento: return 'fas fa-code';
      case ProjectStatus.Planejado: return 'fas fa-clock';
      case ProjectStatus.Pausado: return 'fas fa-pause';
      default: return 'fas fa-question-circle';
    }
  }

  /**
   * Obter classe CSS do status
   */
  getStatusClass(status?: string): string {
    switch (status) {
      case ProjectStatus.Concluido: return 'badge bg-success';
      case ProjectStatus.EmDesenvolvimento: return 'badge bg-primary';
      case ProjectStatus.Planejado: return 'badge bg-warning';
      case ProjectStatus.Pausado: return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }

  /**
   * Track by para otimização de performance
   */
  trackByProjectId(index: number, project: Project): number | string {
    return project.GuidID || index;
  }

  /**
   * Obtém o número total de categorias que possuem projetos
   */
  getTotalCategories(): number {
    return Object.keys(this.stats.byCategory).length;
  }

  // ===== CURRICULUM METHODS =====

  /**
   * Carregar dados do currículo
   */
  loadCurriculumData() {
    this.curriculumService.getPersonalInfo().subscribe({
      next: (response) => this.personalInfo = response.Data[0] || null
    });

    this.curriculumService.getSkills().subscribe({
      next: (response) => this.skills = response.Data || []
    });

    this.curriculumService.getExperiences().subscribe({
      next: (response) => this.experiences = response.Data || []
    });

    this.curriculumService.getEducation().subscribe({
      next: (response) => this.education = response.Data || []
    });

    this.curriculumService.getCertifications().subscribe({
      next: (response) => this.certifications = response.Data || []
    });

    this.curriculumService.getServices().subscribe({
      next: (response) => this.services = response.Data || []
    });
  }

  /**
   * Inicializar formulário de currículo
   */
  initializeCurriculumForm() {
    this.curriculumForm = this.formBuilder.group({});
  }

  /**
   * Abrir modal de currículo
   */
  openCurriculumModal(type: 'personal' | 'skill' | 'experience' | 'education' | 'certification' | 'service', item?: any) {
    this.curriculumModalType = type;
    this.selectedCurriculumItem = item;
    this.isEditCurriculumMode = !!item;
    this.setupCurriculumForm(type, item);
    this.showCurriculumModal = true;
  }

  /**
   * Configurar formulário baseado no tipo
   */
  setupCurriculumForm(type: string, item?: any) {
    this.curriculumForm.reset();
    
    switch (type) {
      case 'personal':
        this.curriculumForm = this.formBuilder.group({
          Name: [item?.Name || '', Validators.required],
          Title: [item?.Title || '', Validators.required],
          Description: [item?.Description || ''],
          Location: [item?.Location || ''],
          Phone: [item?.Phone || ''],
          Email: [item?.Email || ''],
          LinkedInUrl: [item?.LinkedInUrl || ''],
          GitHubUrl: [item?.GitHubUrl || ''],
                    PortfolioUrl: [item?.PortfolioUrl || '']
        });
        break;
      case 'skill':
        this.curriculumForm = this.formBuilder.group({
          Name: [item?.Name || '', Validators.required],
          Category: [item?.Category || '', Validators.required],
          Level: [item?.Level || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
          Icon: [item?.Icon || ''],
          Color: [item?.Color || '#007bff']
        });
        break;
      case 'experience':
        this.curriculumForm = this.formBuilder.group({
          Title: [item?.Title || '', Validators.required],
          Company: [item?.Company || '', Validators.required],
          StartDate: [item?.StartDate || '', Validators.required],
          EndDate: [item?.EndDate || ''],
          Location: [item?.Location || ''],
          Description: [item?.Description || ''],
          IsCurrentJob: [item?.IsCurrentJob || false]
        });
        break;
      case 'education':
        this.curriculumForm = this.formBuilder.group({
          Degree: [item?.Degree || '', Validators.required],
          Institution: [item?.Institution || '', Validators.required],
          StartDate: [item?.StartDate || '', Validators.required],
          EndDate: [item?.EndDate || ''],
          Location: [item?.Location || ''],
          Grade: [item?.Grade || ''],
          Description: [item?.Description || '']
        });
        break;
      case 'certification':
        this.curriculumForm = this.formBuilder.group({
          Name: [item?.Name || '', Validators.required],
          Issuer: [item?.Issuer || '', Validators.required],
          IssueDate: [item?.IssueDate || '', Validators.required],
          ExpiryDate: [item?.ExpiryDate || ''],
          CredentialId: [item?.CredentialId || ''],
          CredentialUrl: [item?.CredentialUrl || ''],
          Description: [item?.Description || '']
        });
        break;
      case 'service':
        this.curriculumForm = this.formBuilder.group({
          Title: [item?.Title || '', Validators.required],
          Description: [item?.Description || ''],
          Icon: [item?.Icon || ''],
          Price: [item?.Price || 0, [Validators.min(0)]],
          Currency: [item?.Currency || 'BRL'],
          Duration: [item?.Duration || '']
        });
        break;
    }
  }

  /**
   * Fechar modal de currículo
   */
  closeCurriculumModal() {
    this.showCurriculumModal = false;
    this.selectedCurriculumItem = null;
    this.curriculumForm.reset();
  }

  /**
   * Salvar item do currículo
   */
  saveCurriculumItem(formData?: any) {
    // Se não recebeu dados do formulário, usa o formulário interno (não deveria acontecer mais)
    const dataToSave = formData || this.curriculumForm.value;

    this.saveCurriculumByType(dataToSave).subscribe({
      next: () => {
        this.successMessage = this.isEditCurriculumMode 
          ? 'Item atualizado com sucesso!' 
          : 'Item adicionado com sucesso!';
        this.closeCurriculumModal();
        this.loadCurriculumData();
      },
      error: (error) => {
        console.error('Erro ao salvar item do currículo:', error);
        this.error = 'Erro ao salvar item. Tente novamente.';
      }
    });
  }

  /**
   * Salvar por tipo
   */
  private saveCurriculumByType(formData: any): Observable<any> {
    switch (this.curriculumModalType) {
      case 'personal':
        return this.isEditCurriculumMode 
          ? this.curriculumService.updatePersonalInfo(formData)
          : this.curriculumService.createPersonalInfo(formData);
      
      case 'skill':
        return this.isEditCurriculumMode 
          ? this.curriculumService.updateSkill(formData)
          : this.curriculumService.createSkill(formData);
      
      case 'experience':
        return this.isEditCurriculumMode 
          ? this.curriculumService.updateExperience(formData)
          : this.curriculumService.createExperience(formData);
      
      case 'education':
        return this.isEditCurriculumMode 
          ? this.curriculumService.updateEducation(formData)
          : this.curriculumService.createEducation(formData);
      
      case 'certification':
        return this.isEditCurriculumMode 
          ? this.curriculumService.updateCertification(formData)
          : this.curriculumService.createCertification(formData);
      
      case 'service':
        return this.isEditCurriculumMode 
          ? this.curriculumService.updateService(formData)
          : this.curriculumService.createService(formData);
      
      default:
        return new Observable(observer => observer.error('Tipo não suportado'));
    }
  }

  /**
   * Excluir item do currículo
   */
  deleteCurriculumItem(type: string, item: any) {
    const itemName = item.Name || item.Title || item.Degree || 'item';
    
    Swal.fire({
      title: 'Confirmar Exclusão',
      html: `
        <div class="text-center">
          <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <p>Tem certeza que deseja excluir o ${type} <strong>${itemName}</strong>?</p>
          <p class="text-muted">Esta ação não pode ser desfeita.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeCurriculumItemDeletion(type, item);
      }
    });
  }

  /**
   * Executar exclusão do item do currículo
   */
  private executeCurriculumItemDeletion(type: string, item: any) {
    let deleteOperation: Observable<any>;

    switch (type) {
      case 'skill':
        deleteOperation = this.curriculumService.deleteSkill(item.id);
        break;
      case 'experience':
        deleteOperation = this.curriculumService.deleteExperience(item.id);
        break;
      case 'education':
        deleteOperation = this.curriculumService.deleteEducation(item.id);
        break;
      case 'certification':
        deleteOperation = this.curriculumService.deleteCertification(item.id);
        break;
      case 'service':
        deleteOperation = this.curriculumService.deleteService(item.id);
        break;
      default:
        this.error = 'Tipo não suportado';
        return;
    }

    deleteOperation.subscribe({
      next: () => {
        this.successMessage = 'Item excluído com sucesso!';
        this.loadCurriculumData();
      }
    });
  }

  /**
   * Obter título do modal de currículo
   */
  getCurriculumModalTitle(): string {
    const action = this.isEditCurriculumMode ? 'Editar' : 'Adicionar';
    const typeNames = {
      personal: 'Informações Pessoais',
      skill: 'Habilidade',
      experience: 'Experiência',
      education: 'Educação',
      certification: 'Certificação',
      service: 'Serviço'
    };
    return `${action} ${typeNames[this.curriculumModalType]}`;
  }

  /**
   * Formatar data para input
   */
  private formatDateForInput(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
} 