import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContactMessage, ContactInfo, ContactConfig } from '../../models/contact.model';
import { AppConstants } from '../constants/app.constants';
import { environment } from '../../../environments/environment';
import { RequestViewModel } from 'src/app/models/request.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly contactConfig: ContactConfig = {
    EnableEmailService: true,
    EmailServiceProvider: 'api',
    EnableWhatsApp: true,
    EnableSocialLinks: true
  };

  constructor(private apiService: ApiService) { }

  /**
   * Enviar mensagem de contato via API
   */
  sendContactMessage(message: ContactMessage): Observable<RequestViewModel<ContactMessage>> {
    return this.apiService.post<RequestViewModel<ContactMessage>>(
      `${AppConstants.API_ENDPOINTS.CONTACT.BASE}/${AppConstants.API_ENDPOINTS.CONTACT.SEND}`,
      message
    );
  }

  /**
   * Obter informações de contato configuradas
   */
  getContactInfo(): Observable<RequestViewModel<ContactInfo>> {
    return this.apiService.get<RequestViewModel<ContactInfo>>(
      `${AppConstants.API_ENDPOINTS.CONTACT.BASE}/${AppConstants.API_ENDPOINTS.CONTACT.GET_INFO}`
    );
  }

  /**
   * Enviar mensagem via WhatsApp
   */
  sendWhatsAppMessage(contactInfo: ContactInfo, customMessage?: string): void {
    const defaultMessage = 'Olá, vim pelo seu site, gostaria de conversar, você tem disponibilidade?';
    const message = encodeURIComponent(customMessage || defaultMessage);
    const whatsappUrl = `https://wa.me/${contactInfo.WhatsAppNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Abrir cliente de email
   */
  openEmail(contactInfo: ContactInfo, subject?: string, body?: string): void {
    const encodedSubject = encodeURIComponent(subject || '🤝 Contato via Portfolio');
    const encodedBody = encodeURIComponent(body || '');
    
    const mailtoUrl = `mailto:${contactInfo.Email}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoUrl;
  }

  /**
   * Criar mensagem de email formatada
   */
  createEmailFromContactForm(formData: ContactMessage): { subject: string; body: string } {
    const subject = `[Portfolio] ${formData.Subject}`;
    const body = `Nome: ${formData.Name}\n\n` +
                 `Email: ${formData.Email}\n\n` +
                 `Mensagem:\n${formData.Message}`;
    
    return { subject, body };
  }

  /**
   * Validar formulário de contato
   */
  validateContactMessage(message: ContactMessage): string[] {
    const errors: string[] = [];

    if (!message.Name || message.Name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!message.Email || !this.isValidEmail(message.Email)) {
      errors.push('Email deve ser válido');
    }

    if (!message.Subject || message.Subject.trim().length < 5) {
      errors.push('Assunto deve ter pelo menos 5 caracteres');
    }

    if (!message.Message || message.Message.trim().length < 10) {
      errors.push('Mensagem deve ter pelo menos 10 caracteres');
    }

    return errors;
  }

  /**
   * Verificar se email é válido
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = new RegExp(AppConstants.PATTERNS.EMAIL);
    return emailRegex.test(email);
  }

  /**
   * Obter configurações de contato
   */
  getContactConfig(): ContactConfig {
    return { ...this.contactConfig };
  }

  /**
   * Atualizar configurações de contato (para admin)
   */
  updateContactConfig(config: Partial<ContactConfig>): void {
    Object.assign(this.contactConfig, config);
  }

  /**
   * Registrar tentativa de contato para analytics (opcional)
   */
  trackContactAttempt(type: 'form' | 'whatsapp' | 'email' | 'social'): void {
    const key = `contact_attempt_${type}`;
    const attempts = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, attempts.toString());
    
    // Log apenas em desenvolvimento
    if (!environment.production) {
        console.log(`Contact attempt tracked: ${type}`);
    }
  }
} 