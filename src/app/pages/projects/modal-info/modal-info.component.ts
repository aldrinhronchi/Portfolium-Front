import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Project, ProjectUtils } from '../../../models/project.model';

@Component({
    selector: 'app-modal-info',
    templateUrl: './modal-info.component.html',
    styleUrls: ['./modal-info.component.css'],
    standalone: false
})
export class ModalInfoComponent implements OnInit, OnChanges {
  @Input() project: Project | null = null;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && this.project) {
      // Project data will be displayed via template binding
    }
  }

  /**
   * Obter lista de tecnologias
   */
  getTechnologiesList(): string[] {
    if (!this.project) return [];
    return ProjectUtils.getTechnologiesList(this.project);
  }

  /**
   * Obter lista de imagens adicionais
   */
  getAdditionalImagesList(): string[] {
    if (!this.project) return [];
    return ProjectUtils.getAdditionalImagesList(this.project);
  }

  /**
   * Obter imagem principal
   */
  getMainImage(): string {
    return this.project?.MainImage || '/assets/img/portfolio/portfolio-1.jpg';
  }

  /**
   * Abrir URL do projeto
   */
  openProjectUrl() {
    if (this.project?.ProjectUrl) {
      window.open(this.project.ProjectUrl, '_blank');
    }
  }

  /**
   * Abrir URL da demo
   */
  openDemoUrl() {
    if (this.project?.DemoUrl) {
      window.open(this.project.DemoUrl, '_blank');
    }
  }

  /**
   * Abrir URL do repositório
   */
  openRepositoryUrl() {
    if (this.project?.RepositoryUrl) {
      window.open(this.project.RepositoryUrl, '_blank');
    }
  }

  /**
   * Formatar data
   */
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'N/A';
    return dateObj.toLocaleDateString('pt-BR');
  }

  /**
   * Obter classe do status
   */
  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'Concluído': return 'bg-success';
      case 'Em Desenvolvimento': return 'bg-primary';
      case 'Pausado': return 'bg-warning';
      case 'Arquivado': return 'bg-secondary';
      case 'Planejado': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  /**
   * Obter classe para layout dos botões baseado na quantidade
   */
  getButtonLayoutClass(): string {
    if (!this.project) return 'buttons-none';
    
    let buttonCount = 0;
    if (this.project.DemoUrl) buttonCount++;
    if (this.project.RepositoryUrl) buttonCount++;
    if (this.project.ProjectUrl) buttonCount++;
    
    switch (buttonCount) {
      case 1: return 'buttons-single';
      case 2: return 'buttons-double';
      case 3: return 'buttons-triple';
      default: return 'buttons-none';
    }
  }
}