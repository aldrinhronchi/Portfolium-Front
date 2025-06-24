import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AppConstants } from '../constants/app.constants';

/**
 * Utilitários de validação centralizados
 */
export class ValidationUtils {

  /**
   * Validador de email customizado
   */
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const isValid = AppConstants.PATTERNS.EMAIL.test(control.value);
      return isValid ? null : { invalidEmail: true };
    };
  }

  /**
   * Validador de URL customizado
   */
  static urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const isValid = AppConstants.PATTERNS.URL.test(control.value);
      return isValid ? null : { invalidUrl: true };
    };
  }

  /**
   * Validador de senha forte
   */
  static strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value;
      const hasMinLength = value.length >= AppConstants.VALIDATION.MIN_PASSWORD_LENGTH;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChars = /[@$!%*?&]/.test(value);
      
      const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
      
      return isValid ? null : { weakPassword: true };
    };
  }

  /**
   * Validador de confirmação de senha
   */
  static confirmPasswordValidator(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const password = control.parent?.get(passwordField)?.value;
      const confirmPassword = control.value;
      
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  /**
   * Validador de telefone
   */
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const isValid = AppConstants.PATTERNS.PHONE.test(control.value);
      return isValid ? null : { invalidPhone: true };
    };
  }

  /**
   * Validador de tamanho de arquivo
   */
  static fileSizeValidator(maxSize: number = AppConstants.FILE.MAX_SIZE): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      if (file && file.size > maxSize) {
        return { fileSizeExceeded: { maxSize, actualSize: file.size } };
      }
      
      return null;
    };
  }

  /**
   * Validador de tipo de arquivo
   */
  static fileTypeValidator(allowedTypes: readonly string[] = AppConstants.FILE.ALLOWED_TYPES): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      if (file && !allowedTypes.includes(file.type)) {
        return { invalidFileType: { allowedTypes, actualType: file.type } };
      }
      
      return null;
    };
  }

  /**
   * Validador de range numérico
   */
  static rangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = Number(control.value);
      if (isNaN(value) || value < min || value > max) {
        return { outOfRange: { min, max, actual: value } };
      }
      
      return null;
    };
  }

  /**
   * Validador de whitespace
   */
  static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  /**
   * Obter mensagem de erro formatada
   */
  static getErrorMessage(control: AbstractControl, fieldName: string = 'Campo'): string {
    if (!control.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) {
      return AppConstants.ERROR_MESSAGES.REQUIRED;
    }

    if (errors['invalidEmail']) {
      return AppConstants.ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (errors['invalidUrl']) {
      return AppConstants.ERROR_MESSAGES.INVALID_URL;
    }

    if (errors['weakPassword']) {
      return AppConstants.ERROR_MESSAGES.WEAK_PASSWORD;
    }

    if (errors['passwordMismatch']) {
      return 'As senhas não conferem';
    }

    if (errors['invalidPhone']) {
      return 'Telefone inválido';
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return AppConstants.ERROR_MESSAGES.MIN_LENGTH(requiredLength);
    }

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return AppConstants.ERROR_MESSAGES.MAX_LENGTH(maxLength);
    }

    if (errors['min']) {
      const min = errors['min'].min;
      return `Valor mínimo: ${min}`;
    }

    if (errors['max']) {
      const max = errors['max'].max;
      return `Valor máximo: ${max}`;
    }

    if (errors['outOfRange']) {
      const { min, max } = errors['outOfRange'];
      return `Valor deve estar entre ${min} e ${max}`;
    }

    if (errors['fileSizeExceeded']) {
      const { maxSize } = errors['fileSizeExceeded'];
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return `Arquivo muito grande. Máximo: ${maxSizeMB}MB`;
    }

    if (errors['invalidFileType']) {
      const { allowedTypes } = errors['invalidFileType'];
      return `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`;
    }

    if (errors['whitespace']) {
      return `${fieldName} não pode conter apenas espaços`;
    }

    return `${fieldName} inválido`;
  }

  /**
   * Verificar se formulário tem erros
   */
  static hasErrors(control: AbstractControl): boolean {
    return !!(control.errors && control.touched);
  }

  /**
   * Marcar todos os campos como touched
   */
  static markAllFieldsAsTouched(formGroup: AbstractControl): void {
    Object.keys(formGroup.value).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        
        if (control.value && typeof control.value === 'object') {
          this.markAllFieldsAsTouched(control);
        }
      }
    });
  }

  /**
   * Limpar erros de um formulário
   */
  static clearErrors(formGroup: AbstractControl): void {
    Object.keys(formGroup.value).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsUntouched();
      }
    });
  }
} 