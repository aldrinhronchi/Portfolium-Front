import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillCategory, CurriculumUtils } from '../../../../models/curriculum.model';

@Component({
  selector: 'app-curriculum-form-modal',
  templateUrl: './curriculum-form-modal.component.html',
  styleUrls: ['./curriculum-form-modal.component.css'],
  standalone: false,
})
export class CurriculumFormModalComponent implements OnInit, OnChanges {
  @Input() type: 'personal' | 'skill' | 'experience' | 'education' | 'certification' | 'service' = 'personal';
  @Input() item: any = null;
  @Input() isEditMode = false;
  @Input() isVisible = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  curriculumForm!: FormGroup;
  skillCategories = Object.values(SkillCategory);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.loadItemData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detecta mudanças no tipo - recria o formulário
    if (changes['type'] && !changes['type'].firstChange) {
      this.initializeForm();
      this.loadItemData();
    }
    // Detecta mudanças nos dados do item
    else if (changes['item'] && !changes['item'].firstChange) {
      this.loadItemData();
    }
  }

  private loadItemData() {
    if (this.item && this.isEditMode) {
      this.mapItemToForm();
    } else {
      // Resetar formulário com valores padrão baseados no tipo
      this.resetFormDefaults();
    }
  }

  private resetFormDefaults() {
    switch (this.type) {
      case 'personal':
        this.curriculumForm.reset({
          Name: '',
          Title: '',
          Description: '',
          Location: '',
          Phone: '',
          Email: '',
          LinkedInUrl: '',
          GitHubUrl: '',
          PortfolioUrl: ''
        });
        break;
      
      case 'skill':
        this.curriculumForm.reset({
          Name: '',
          Category: '',
          Level: 50,
          Icon: '',
          Color: '#007bff',
          DisplayOrder: 0,
          IsActive: true
        });
        break;
      
      case 'experience':
        this.curriculumForm.reset({
          Title: '',
          Company: '',
          StartDate: '',
          EndDate: '',
          Location: '',
          Description: '',
          IsCurrentJob: false,
          DisplayOrder: 0,
          IsActive: true
        });
        break;
      
      case 'education':
        this.curriculumForm.reset({
          Degree: '',
          Institution: '',
          StartDate: '',
          EndDate: '',
          Location: '',
          Grade: '',
          Description: '',
          DisplayOrder: 0,
          IsActive: true
        });
        break;
      
      case 'certification':
        this.curriculumForm.reset({
          Name: '',
          Issuer: '',
          IssueDate: '',
          ExpiryDate: '',
          CredentialId: '',
          CredentialUrl: '',
          Description: '',
          DisplayOrder: 0,
          IsActive: true
        });
        break;
      
      case 'service':
        this.curriculumForm.reset({
          Title: '',
          Description: '',
          Icon: '',
          Price: 0,
          Currency: 'BRL',
          Duration: '',
          DisplayOrder: 0,
          IsActive: true
        });
        break;
    }
  }

  private mapItemToForm() {
    if (!this.item) return;

    let formData: any = {};

    // Mapeamento específico por tipo usando os nomes corretos dos campos
    switch (this.type) {
      case 'personal':
        formData = {
          Name: this.item.Name || '',
          Title: this.item.Title || '',
          Description: this.item.Description || '',
          Location: this.item.Location || '',
          Phone: this.item.Phone || '',
          Email: this.item.Email || '',
          LinkedInUrl: this.item.LinkedInUrl || '',
          GitHubUrl: this.item.GitHubUrl || '',
          PortfolioUrl: this.item.PortfolioUrl || ''
        };
        break;
      
      case 'skill':
        formData = {
          Name: this.item.Name || '',
          Category: this.item.Category || '',
          Level: this.item.Level || 50,
          Icon: this.item.Icon || '',
          Color: this.item.Color || '#007bff',
          DisplayOrder: this.item.DisplayOrder || 0,
          IsActive: this.item.IsActive !== false
        };
        break;
      
      case 'experience':
        formData = {
          Title: this.item.Title || '',
          Company: this.item.Company || '',
          StartDate: CurriculumUtils.formatDateForInput(this.item.StartDate),
          EndDate: CurriculumUtils.formatDateForInput(this.item.EndDate),
          Location: this.item.Location || '',
          Description: this.item.Description || '',
          IsCurrentJob: this.item.IsCurrentJob || false,
          DisplayOrder: this.item.DisplayOrder || 0,
          IsActive: this.item.IsActive !== false
        };
        break;
      
      case 'education':
        formData = {
          Degree: this.item.Degree || '',
          Institution: this.item.Institution || '',
          StartDate: CurriculumUtils.formatDateForInput(this.item.StartDate),
          EndDate: CurriculumUtils.formatDateForInput(this.item.EndDate),
          Location: this.item.Location || '',
          Grade: this.item.Grade || '',
          Description: this.item.Description || '',
          DisplayOrder: this.item.DisplayOrder || 0,
          IsActive: this.item.IsActive !== false
        };
        break;
      
      case 'certification':
        formData = {
          Name: this.item.Name || '',
          Issuer: this.item.Issuer || '',
          IssueDate: CurriculumUtils.formatDateForInput(this.item.IssueDate),
          ExpiryDate: CurriculumUtils.formatDateForInput(this.item.ExpiryDate),
          CredentialId: this.item.CredentialId || '',
          CredentialUrl: this.item.CredentialUrl || '',
          Description: this.item.Description || '',
          DisplayOrder: this.item.DisplayOrder || 0,
          IsActive: this.item.IsActive !== false
        };
        break;
      
      case 'service':
        formData = {
          Title: this.item.Title || '',
          Description: this.item.Description || '',
          Icon: this.item.Icon || '',
          Price: this.item.Price || 0,
          Currency: this.item.Currency || 'BRL',
          Duration: this.item.Duration || '',
          DisplayOrder: this.item.DisplayOrder || 0,
          IsActive: this.item.IsActive !== false
        };
        break;
    }

    this.curriculumForm.patchValue(formData);
  }

  private initializeForm() {
    // Criar formulário baseado no tipo
    switch (this.type) {
      case 'personal':
        this.curriculumForm = this.formBuilder.group({
          Name: ['', Validators.required],
          Title: ['', Validators.required],
          Description: [''],
          Location: [''],
          Phone: [''],
          Email: ['', Validators.email],
          LinkedInUrl: [''],
          GitHubUrl: [''],
          PortfolioUrl: ['']
        });
        break;
      
      case 'skill':
        this.curriculumForm = this.formBuilder.group({
          Name: ['', Validators.required],
          Category: ['', Validators.required],
          Level: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
          Icon: [''],
          Color: ['#007bff'],
          DisplayOrder: [0, Validators.min(0)],
          IsActive: [true]
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
          IsCurrentJob: [false],
          DisplayOrder: [0, Validators.min(0)],
          IsActive: [true]
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
          DisplayOrder: [0, Validators.min(0)],
          IsActive: [true]
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
          Description: [''],
          DisplayOrder: [0, Validators.min(0)],
          IsActive: [true]
        });
        break;
      
      case 'service':
        this.curriculumForm = this.formBuilder.group({
          Title: ['', Validators.required],
          Description: ['', Validators.required],
          Icon: [''],
          Price: [0, Validators.min(0)],
          Currency: ['BRL'],
          Duration: [''],
          DisplayOrder: [0, Validators.min(0)],
          IsActive: [true]
        });
        break;
      
      default:
        // Formulário genérico como fallback
        this.curriculumForm = this.formBuilder.group({
          Title: ['', Validators.required],
          Description: [''],
          IsActive: [true]
        });
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

  closeModal() {
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