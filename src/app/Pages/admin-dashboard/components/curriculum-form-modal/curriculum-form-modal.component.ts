import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillCategory, CurriculumUtils } from '../../../../models/curriculum.model';

@Component({
  selector: 'app-curriculum-form-modal',
  templateUrl: './curriculum-form-modal.component.html',
  styleUrls: ['./curriculum-form-modal.component.css'],
  standalone: false,
})
export class CurriculumFormModalComponent implements OnInit {
  @Input() type: 'personal' | 'skill' | 'experience' | 'education' | 'certification' | 'service' = 'personal';
  @Input() item: any = null;
  @Input() isEditMode = false;
  @Input() loading = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  curriculumForm!: FormGroup;
  skillCategories = Object.values(SkillCategory);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    if (this.item && this.isEditMode) {
      const itemForForm = CurriculumUtils.prepareCurriculumItemForForm(this.item);
      this.curriculumForm.patchValue(itemForForm);
    }
  }

  private initializeForm() {
    this.curriculumForm = this.formBuilder.group({});
    this.setupFormByType();
  }

  private setupFormByType() {
    switch (this.type) {
      case 'personal':
        this.curriculumForm = this.formBuilder.group({
          Name: ['', Validators.required],
          Title: ['', Validators.required],
          Description: [''],
          Location: [''],
          Phone: [''],
          Email: [''],
          // Campos estatísticos
          YearsExperience: [0, [Validators.min(0)]],
          ProjectsCompleted: [0, [Validators.min(0)]],
          HappyClients: [0, [Validators.min(0)]],
          Certifications: [0, [Validators.min(0)]],
          // Redes sociais
          LinkedInUrl: [''],
          GitHubUrl: [''],
          PortfolioUrl: ['']
        });
        break;
      case 'skill':
        this.curriculumForm = this.formBuilder.group({
          Name: ['', Validators.required],
          Category: ['', Validators.required],
          Level: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
          Icon: [''],
          Color: ['#007bff']
        });
        break;
      case 'experience':
        this.curriculumForm = this.formBuilder.group({
          Title: ['', Validators.required],
          Company: ['', Validators.required],
          StartDate: ['', Validators.required],
          EndDate: [''],
          Location: [''],
          Description: [''],
          // Campos detalhados
          Responsibilities: [''],
          Technologies: [''],
          Achievements: [''],
          IsCurrentJob: [false]
        });
        break;
      case 'education':
        this.curriculumForm = this.formBuilder.group({
          Degree: ['', Validators.required],
          Institution: ['', Validators.required],
          StartDate: ['', Validators.required],
          EndDate: [''],
          Location: [''],
          Grade: [''],
          Description: [''],
          // Campo de conquistas
          Achievements: ['']
        });
        break;
      case 'certification':
        this.curriculumForm = this.formBuilder.group({
          Name: ['', Validators.required],
          Issuer: ['', Validators.required],
          IssueDate: ['', Validators.required],
          ExpiryDate: [''],
          CredentialId: [''],
          CredentialUrl: [''],
          Description: ['']
        });
        break;
      case 'service':
        this.curriculumForm = this.formBuilder.group({
          Title: ['', Validators.required],
          Description: [''],
          Icon: [''],
          // Campo de funcionalidades
          Features: [''],
          Price: [0, [Validators.min(0)]],
          Currency: ['BRL'],
          Duration: ['']
        });
        break;
    }
  }

  onSubmit() {
    if (this.curriculumForm.valid) {
      const formData = { ...this.curriculumForm.value };
      
      // Se estiver editando, preservar o ID do item original
      if (this.isEditMode && this.item) {
        formData.ID = this.item.ID;
        formData.GuidID = this.item.GuidID;
      }
      
      this.save.emit(formData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  getModalTitle(): string {
    const action = this.isEditMode ? 'Editar' : 'Adicionar';
    const typeNames = {
      personal: 'Informações Pessoais',
      skill: 'Habilidade',
      experience: 'Experiência',
      education: 'Educação',
      certification: 'Certificação',
      service: 'Serviço'
    };
    return `${action} ${typeNames[this.type]}`;
  }

  hasError(fieldName: string): boolean {
    const field = this.curriculumForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.curriculumForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['min']) return `Valor mínimo é ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo é ${field.errors['max'].max}`;
    }
    return '';
  }
} 