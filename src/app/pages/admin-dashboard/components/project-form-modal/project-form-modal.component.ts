import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project, ProjectStatus, ProjectCategory, ProjectUtils } from '../../../../models/project.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-project-form-modal',
  templateUrl: './project-form-modal.component.html',
  styleUrls: ['./project-form-modal.component.css'],
  standalone: false,
})
export class ProjectFormModalComponent implements OnInit, OnChanges {
  @Input() project: Project | null = null;
  @Input() isEditMode = false;
  @Input() isViewMode = false;
  @Input() isVisible = false;
  @Output() save = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  projectForm!: FormGroup;
  projectStatuses = Object.values(ProjectStatus);
  projectCategories = Object.values(ProjectCategory);
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.initializeForm();
    this.loadProjectData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detecta mudanças nos dados do projeto
    if (changes['project'] && !changes['project'].firstChange) {
      this.loadProjectData();
    }
    
    // Detecta mudanças no modo de visualização
    if (changes['isViewMode'] && this.projectForm) {
      if (this.isViewMode) {
        this.projectForm.disable();
      } else {
        this.projectForm.enable();
      }
    }
  }

  private loadProjectData() {
    if (this.project && (this.isEditMode || this.isViewMode)) {
      // Mapear os dados do projeto para o formulário
      this.projectForm.patchValue({
        name: this.project.Name || '',
        description: this.project.Description || '',
        technologies: this.project.Technologies || '',
        url: this.project.ProjectUrl || this.project.DemoUrl || '',
        githubUrl: this.project.RepositoryUrl || '',
        imageUrl: this.project.MainImage || '',
        isActive: this.project.IsActive !== false // Default true se não especificado
      });
    } else {
      // Resetar formulário para novo projeto
      this.projectForm.reset({
        name: '',
        description: '',
        technologies: '',
        url: '',
        githubUrl: '',
        imageUrl: '',
        isActive: true
      });
    }
    
    // Desabilitar formulário em modo de visualização
    if (this.isViewMode) {
      this.projectForm.disable();
    } else {
      this.projectForm.enable();
    }
  }

  private initializeForm(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      technologies: [''],
      url: [''],
      githubUrl: [''],
      imageUrl: [''],
      isActive: [true]
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.isLoading = true;
      const projectData = this.projectForm.value;
      this.save.emit(projectData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  closeModal() {
    this.cancel.emit();
  }

  getModalTitle(): string {
    if (this.isViewMode) {
      return 'Visualizar Projeto';
    }
    return this.isEditMode ? 'Editar Projeto' : 'Novo Projeto';
  }

  hasError(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `Valor mínimo é ${field.errors['min'].min}`;
    }
    return '';
  }
} 