import { RequestViewModel } from './request.viewmodel';

// Interface para dados de contato
export interface ContactMessage {
  Name: string;
  Email: string;
  Subject: string;
  Message: string;
}

// Usando RequestViewModel para respostas
export type ContactResponse = RequestViewModel<any>;

// Interface para informações de contato do usuário
export interface ContactInfo {
  Phone: string;
  Email: string;
  Location: string;
  WhatsAppNumber?: string;
  LinkedIn?: string;
  GitHub?: string;
  ResponseTime?: string;
}

// Enum para tipos de contato
export enum ContactType {
  Email = 'email',
  WhatsApp = 'whatsapp',
  LinkedIn = 'linkedin',
  GitHub = 'github'
}

// Interface para configurações de contato
export interface ContactConfig {
  EnableEmailService: boolean;
  EmailServiceProvider: 'api' | 'mailto' | 'emailjs';
  EnableWhatsApp: boolean;
  EnableSocialLinks: boolean;
} 