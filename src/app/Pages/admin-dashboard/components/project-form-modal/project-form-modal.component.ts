import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project, ProjectStatus, ProjectCategory, ProjectUtils } from '../../../../models/project.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-project-form-modal',
  templateUrl: './project-form-modal.component.html',
  styleUrls: ['./project-form-modal.component.css'],
  standalone: false,
})
export class ProjectFormModalComponent implements OnInit {
  @Input() project: Project | null = null;
  @Input() isEditMode = false;
  @Input() isViewMode = false;
  @Output() save = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  projectForm!: FormGroup;
  projectStatuses = Object.values(ProjectStatus);
  projectCategories = Object.values(ProjectCategory);

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.initializeForm();
    if (this.project && (this.isEditMode || this.isViewMode)) {
      const projectForForm = ProjectUtils.prepareProjectForForm(this.project);
      this.projectForm.patchValue({
        ...projectForForm,
        GuidID: this.project.GuidID || ''
      });
    }
    
    // Desabilitar formulário em modo de visualização
    if (this.isViewMode) {
      this.projectForm.disable();
    }
  }

  private initializeForm(): void {
    this.projectForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(200)]],
      Description: ['', Validators.maxLength(2000)],
      ShortDescription: ['', Validators.maxLength(500)],
      Category: ['', Validators.required],
      Status: ['', Validators.required],
      IsFeatured: [false],
      StartDate: [''],
      EndDate: [''],
      // URLs
      ProjectUrl: [''],
      DemoUrl: [''],
      RepositoryUrl: [''],
      // Imagens
      MainImage: [''],
      AdditionalImages: [''],
      ImageUrl: [''], // Mantido para compatibilidade
      // Outros campos
      Technologies: [''],
      Features: [''],
      Challenges: [''],
      Lessons: [''],
      DisplayOrder: [0, [Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      // Usa ProjectUtils para preparar os dados do formulário para salvamento
      const projectData = ProjectUtils.prepareProjectForSave(this.projectForm.value);
      this.save.emit(projectData);
    }
  }

  onCancel() {
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