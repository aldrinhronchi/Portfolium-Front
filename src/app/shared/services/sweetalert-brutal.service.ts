import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertBrutalService {

  constructor() { }

  /**
   * Configuração padrão brutalista para SweetAlert2
   */
  private getBrutalConfig() {
    return {
      allowOutsideClick: false,
      customClass: {
        popup: 'swal2-brutal-popup',
        title: 'swal2-brutal-title',
        htmlContainer: 'swal2-brutal-content',
        confirmButton: 'swal2-brutal-confirm',
        denyButton: 'swal2-brutal-deny',
        cancelButton: 'swal2-brutal-cancel',
        icon: 'swal2-brutal-icon'
      },
      buttonsStyling: false
    };
  }

  /**
   * Alerta de sucesso brutalista
   */
  success(title: string, message: string, confirmText: string = 'PERFEITO!'): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...this.getBrutalConfig(),
      title: title.toUpperCase(),
      text: message,
      icon: 'success',
      confirmButtonText: confirmText.toUpperCase()
    });
  }

  /**
   * Alerta de erro brutalista
   */
  error(title: string, message: string, confirmText: string = 'ENTENDI'): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...this.getBrutalConfig(),
      title: title.toUpperCase(),
      text: message,
      icon: 'error',
      confirmButtonText: confirmText.toUpperCase()
    });
  }

  /**
   * Alerta de warning brutalista
   */
  warning(title: string, message: string, confirmText: string = 'OK'): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...this.getBrutalConfig(),
      title: title.toUpperCase(),
      text: message,
      icon: 'warning',
      confirmButtonText: confirmText.toUpperCase()
    });
  }

  /**
   * Alerta de info brutalista
   */
  info(title: string, message: string, confirmText: string = 'ENTENDI'): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...this.getBrutalConfig(),
      title: title.toUpperCase(),
      text: message,
      icon: 'info',
      confirmButtonText: confirmText.toUpperCase()
    });
  }

  /**
   * Confirmação brutalista com dois botões
   */
  confirm(
    title: string, 
    message: string, 
    confirmText: string = 'SIM', 
    cancelText: string = 'NÃO'
  ): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...this.getBrutalConfig(),
      title: title.toUpperCase(),
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText.toUpperCase(),
      cancelButtonText: cancelText.toUpperCase()
    });
  }

  /**
   * Confirmação de delete brutalista
   */
  confirmDelete(
    itemName: string,
    confirmText: string = 'SIM, DELETAR',
    cancelText: string = 'CANCELAR'
  ): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...this.getBrutalConfig(),
      title: 'DELETAR ITEM',
      html: `
        <div style="transform: skew(2deg);">
          <p><strong>⚠️ ATENÇÃO!</strong></p>
          <p>Você está prestes a deletar:</p>
          <p style="color: var(--accent-primary); font-weight: 700;">${itemName}</p>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText.toUpperCase(),
      cancelButtonText: cancelText.toUpperCase()
    });
  }

  /**
   * Alerta com HTML customizado
   */
  custom(
    title: string,
    html: string,
    icon: SweetAlertIcon = 'info',
    confirmText: string = 'OK'
  ): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...this.getBrutalConfig(),
      title: title.toUpperCase(),
      html: `<div style="transform: skew(2deg);">${html}</div>`,
      icon: icon,
      confirmButtonText: confirmText.toUpperCase()
    });
  }

  /**
   * Toast brutalista (notificação rápida)
   */
  toast(message: string, icon: SweetAlertIcon = 'success', duration: number = 3000): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      customClass: {
        popup: 'swal2-brutal-toast',
        title: 'swal2-brutal-toast-title'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: icon,
      title: message.toUpperCase()
    });
  }

  /**
   * Loading brutalista
   */
  loading(title: string = 'CARREGANDO...', message: string = 'Aguarde um momento'): void {
    Swal.fire({
      ...this.getBrutalConfig(),
      title: title.toUpperCase(),
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Fechar qualquer alerta aberto
   */
  close(): void {
    Swal.close();
  }

  /**
   * Input brutalista
   */
  input(
    title: string,
    message: string,
    placeholder: string = 'Digite aqui...',
    confirmText: string = 'CONFIRMAR',
    cancelText: string = 'CANCELAR'
  ): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...this.getBrutalConfig(),
      title: title.toUpperCase(),
      text: message,
      input: 'text',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: confirmText.toUpperCase(),
      cancelButtonText: cancelText.toUpperCase(),
      inputValidator: (value) => {
        if (!value) {
          return 'VOCÊ PRECISA DIGITAR ALGO!';
        }
        return null;
      }
    });
  }
} 