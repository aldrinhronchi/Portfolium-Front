import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactMessage, ContactInfo } from '../../models/contact.model';
import { ContactService } from '../../shared/services/contact.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    standalone: false
})
export class ContactComponent implements OnInit {
  
  contactInfo: ContactInfo = {
    Phone: '49999995816',
    Email: 'work.aldrinronchi@gmail.com',
    Location: 'Santa Catarina - Brasil'
  };
  
  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.loadContactInfo();
  }

  /**
   * Carregar informações de contato
   */
  loadContactInfo() {
    this.loading = true;
    this.contactService.getContactInfo().subscribe({
      next: (info) => {
        this.contactInfo = info.Data[0];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar informações de contato:', error);
        // Manter dados padrão em caso de erro
        this.loading = false;
      }
    });
  }

  /**
   * Obter controle do formulário
   */
  get f() {
    return this.contactForm.controls;
  }

  /**
   * Submeter formulário de contato
   */
  onSubmit() {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';

    const formData: ContactMessage = this.contactForm.value;

    // Validar dados antes de enviar
    const validationErrors = this.contactService.validateContactMessage(formData);
    if (validationErrors.length > 0) {
      this.submitMessage = validationErrors.join(', ');
      this.submitSuccess = false;
      this.isSubmitting = false;
      return;
    }

    // Rastrear tentativa de contato
    this.contactService.trackContactAttempt('form');

    // Enviar mensagem
    this.contactService.sendContactMessage(formData).subscribe({
      next: (response) => {
        this.handleSubmitSuccess(response.Message || 'Mensagem enviada com sucesso!');
        
        // Abrir cliente de email com dados preenchidos
        const emailData = this.contactService.createEmailFromContactForm(formData);
        this.contactService.openEmail(this.contactInfo, emailData.subject, emailData.body);
      },
      error: (error) => {
        this.handleSubmitError('Erro ao enviar mensagem. Tente novamente.');
        console.error('Erro no envio:', error);
      }
    });
  }

  /**
   * Tratar sucesso no envio
   */
  private handleSubmitSuccess(message: string) {
    this.isSubmitting = false;
    this.submitSuccess = true;
    this.submitMessage = message;
    this.contactForm.reset();
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      this.submitMessage = '';
      this.submitSuccess = false;
    }, 5000);
  }

  /**
   * Tratar erro no envio
   */
  private handleSubmitError(message: string) {
    this.isSubmitting = false;
    this.submitSuccess = false;
    this.submitMessage = message;
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      this.submitMessage = '';
    }, 5000);
  }

  /**
   * Marcar todos os campos como touched para mostrar erros
   */
  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Verificar se campo tem erro
   */
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.contactForm.get(fieldName);
    if (!field) return false;
    
    if (errorType) {
      return field.hasError(errorType) && field.touched;
    }
    
    return field.invalid && field.touched;
  }

  /**
   * Obter mensagem de erro do campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} é obrigatório`;
    }
    
    if (field.hasError('email')) {
      return 'Digite um email válido';
    }
    
    if (field.hasError('minlength')) {
      const requiredLength = field.getError('minlength').requiredLength;
      return `Mínimo de ${requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  /**
   * Obter nome amigável do campo
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Nome',
      email: 'Email',
      subject: 'Assunto',
      message: 'Mensagem'
    };
    return displayNames[fieldName] || fieldName;
  }

  /**
   * Abrir WhatsApp
   */
  openWhatsApp() {
    this.contactService.trackContactAttempt('whatsapp');
    this.contactService.sendWhatsAppMessage(this.contactInfo);
  }

  /**
   * Abrir email direto
   */
  openEmail() {
    this.contactService.trackContactAttempt('email');
    this.contactService.openEmail(this.contactInfo);
  }

  /**
   * Abrir LinkedIn (se disponível)
   */
  openLinkedIn() {
    if (this.contactInfo.LinkedIn) {
      this.contactService.trackContactAttempt('social');
      window.open(this.contactInfo.LinkedIn, '_blank');
    }
  }

  /**
   * Abrir GitHub (se disponível)
   */
  openGitHub() {
    if (this.contactInfo.GitHub) {
      this.contactService.trackContactAttempt('social');
      window.open(this.contactInfo.GitHub, '_blank');
    }
  }

  /**
   * Verificar se tem redes sociais disponíveis
   */
  hasSocialLinks(): boolean {
    return !!(this.contactInfo.LinkedIn || this.contactInfo.GitHub);
  }
}
