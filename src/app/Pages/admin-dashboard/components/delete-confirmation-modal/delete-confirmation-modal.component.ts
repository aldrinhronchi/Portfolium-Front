import { Component, EventEmitter, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-confirmation-modal',
  template: '', // Não precisamos de template pois usaremos Swal
  styleUrls: ['./delete-confirmation-modal.component.css'],
  standalone: false,
})
export class DeleteConfirmationModalComponent {
  @Input() itemName: string = '';
  @Input() itemType: string = 'item';
  @Input() loading = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit() {
    this.showConfirmationDialog();
  }

  private showConfirmationDialog() {
    Swal.fire({
      title: 'Confirmar Exclusão',
      html: `
        <div class="text-center">
          <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <p>Tem certeza que deseja excluir o ${this.itemType} <strong>${this.itemName}</strong>?</p>
          <p class="text-muted">Esta ação não pode ser desfeita.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirm.emit();
      } else {
        this.cancel.emit();
      }
    });
  }
} 