import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { CurriculumService } from '../../shared/services/curriculum.service';
import { Project } from '../../models/project.model';
import { CurriculumData } from '../../models/curriculum.model';
import { RequestViewModel } from '../../models/request.viewmodel';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  projects: Project[] = [];
  curriculum: CurriculumData | null = null;
  loading = false;
  error: string | null = null;

  showProjectModal = false;
  showCurriculumModal = false;
  selectedProject: Project | null = null;

  constructor(
    private projectService: ProjectService,
    private curriculumService: CurriculumService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.loadCurriculum();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects()
      .subscribe({
        next: (response: RequestViewModel<Project>) => {
          this.projects = response.Data;
          this.loading = false;
        },
        error: (error: Error) => {
          this.error = 'Erro ao carregar projetos';
          this.loading = false;
          console.error('Erro ao carregar projetos:', error);
        }
      });
  }

  loadCurriculum(): void {
    this.loading = true;
    this.curriculumService.getCurriculumData()
      .subscribe({
        next: (response: RequestViewModel<CurriculumData>) => {
          if (response.Data && !Array.isArray(response.Data)) {
            this.curriculum = response.Data;
          }
          this.loading = false;
        },
        error: (error: Error) => {
          this.error = 'Erro ao carregar currículo';
          this.loading = false;
          console.error('Erro ao carregar currículo:', error);
        }
      });
  }

  onAddProject(): void {
    this.selectedProject = null;
    this.showProjectModal = true;
  }

  onEditProject(project: Project): void {
    this.selectedProject = project;
    this.showProjectModal = true;
  }

  onSaveProject(project: Project): void {
    this.loading = true;
    const operation = project.GuidID
      ? this.projectService.updateProject(project)
      : this.projectService.createProject(project);

    operation.subscribe({
      next: () => {
        this.showProjectModal = false;
        this.loadProjects();
      },
      error: (error: Error) => {
        this.error = 'Erro ao salvar projeto';
        this.loading = false;
        console.error('Erro ao salvar projeto:', error);
      }
    });
  }

  onDeleteProject(id: string): void {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      this.loading = true;
      this.projectService.deleteProject(id)
        .subscribe({
          next: () => {
            this.loadProjects();
          },
          error: (error: Error) => {
            this.error = 'Erro ao excluir projeto';
            this.loading = false;
            console.error('Erro ao excluir projeto:', error);
          }
        });
    }
  }

  onAddCurriculum(): void {
    this.showCurriculumModal = true;
  }

  onEditCurriculum(): void {
    this.showCurriculumModal = true;
  }

  onSaveCurriculum(curriculum: CurriculumData): void {
    this.loading = true;
    const operation = this.curriculum
      ? this.curriculumService.updateCurriculumData(curriculum)
      : this.curriculumService.updateCurriculumData(curriculum);

    operation.subscribe({
      next: () => {
        this.showCurriculumModal = false;
        this.loadCurriculum();
      },
      error: (error: Error) => {
        this.error = 'Erro ao salvar currículo';
        this.loading = false;
        console.error('Erro ao salvar currículo:', error);
      }
    });
  }

  onCloseProjectModal(): void {
    this.showProjectModal = false;
    this.selectedProject = null;
  }

  onCloseCurriculumModal(): void {
    this.showCurriculumModal = false;
  }
} 