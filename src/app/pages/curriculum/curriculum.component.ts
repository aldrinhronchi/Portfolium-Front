import { Component, OnInit } from '@angular/core';
import { CurriculumService } from '../../shared/services/curriculum.service';
import { 
  PersonalInfo, 
  Skill, 
  Experience, 
  Education, 
  Certification, 
  Service,
  SkillCategory,
  CurriculumUtils
} from '../../models/curriculum.model';

@Component({
    selector: 'app-curriculum',
    templateUrl: './curriculum.component.html',
    styleUrls: ['./curriculum.component.css'],
    standalone: false
})
export class CurriculumComponent implements OnInit {

  // Dados do currículo
  personalInfo: PersonalInfo | null = null;
  skills: Skill[] = [];
  experiences: Experience[] = [];
  education: Education[] = [];
  certifications: Certification[] = [];
  services: Service[] = [];

  // Estados de carregamento
  loading = {
    personalInfo: false,
    skills: false,
    experiences: false,
    education: false,
    certifications: false,
    services: false
  };

  // Categorias de habilidades disponíveis
  skillCategories = Object.values(SkillCategory);

  // Utilitários
  curriculumUtils = CurriculumUtils;

  constructor(private curriculumService: CurriculumService) { }

  ngOnInit() {
    this.loadAllData();
  }

  /**
   * Carregar todos os dados do currículo
   */
  loadAllData() {
     this.loadPersonalInfo();
     this.loadSkills();
    this.loadExperiences();
    this.loadEducation();
    this.loadCertifications();
    this.loadServices();
  }

  /**
   * Carregar informações pessoais
   */
  loadPersonalInfo() {
    this.loading.personalInfo = true;
    this.curriculumService.getPersonalInfo().subscribe({
      next: (info) => {
        this.personalInfo = info.Data[0];
        this.loading.personalInfo = false;
      },
    });
  }

  /**
   * Carregar habilidades
   */
  loadSkills() {
    this.loading.skills = true;
    this.curriculumService.getSkills().subscribe({
      next: (skills) => {
        this.skills = skills.Data;
        this.loading.skills = false;
      },
    });
  }

  /**
   * Carregar experiências
   */
  loadExperiences() {
    this.loading.experiences = true;
    this.curriculumService.getExperiences().subscribe({
      next: (experiences) => {
        this.experiences = experiences.Data;
        this.loading.experiences = false;
      },
      error: (error) => {
        console.error('Erro ao carregar experiências:', error);
        this.loading.experiences = false;
      }
    });
  }

  /**
   * Carregar educação
   */
  loadEducation() {
    this.loading.education = true;
    this.curriculumService.getEducation().subscribe({
      next: (education) => {
        this.education = education.Data;
        this.loading.education = false;
      },
      error: (error) => {
        console.error('Erro ao carregar educação:', error);
        this.loading.education = false;
      }
    });
  }

  /**
   * Carregar certificações
   */
  loadCertifications() {
    this.loading.certifications = true;
    this.curriculumService.getCertifications().subscribe({
      next: (certifications) => {
        this.certifications = certifications.Data;
        this.loading.certifications = false;
      },
      error: (error) => {
        console.error('Erro ao carregar certificações:', error);
        this.loading.certifications = false;
      }
    });
  }

  /**
   * Carregar serviços
   */
  loadServices() {
    this.loading.services = true;
    this.curriculumService.getServices().subscribe({
      next: (services) => {
        this.services = services.Data;
        this.loading.services = false;
      },
      error: (error) => {
        console.error('Erro ao carregar serviços:', error);
        this.loading.services = false;
      }
    });
  }

  /**
   * Obter habilidades por categoria
   */
  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter(skill => skill.Category === category)
                     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));
  }

  /**
   * Obter classe CSS para nível de habilidade
   */
  getSkillLevelClass(level: number): string {
    return CurriculumUtils.getSkillLevelClass(level);
  }

  /**
   * Obter texto do nível de habilidade
   */
  getSkillLevelText(level: number): string {
    return CurriculumUtils.getSkillLevelText(level);
  }

  /**
   * Formatar período de experiência/educação
   */
  formatPeriod(startDate: Date, endDate?: Date): string {
    return CurriculumUtils.formatPeriod(startDate, endDate);
  }

  /**
   * Obter período formatado para educação
   */
  getEducationPeriod(education: Education): string {
    return this.formatPeriod(education.StartDate, education.EndDate);
  }

  /**
   * Obter período formatado para experiência
   */
  getExperiencePeriod(experience: Experience): string {
      return this.formatPeriod(experience.StartDate, experience.EndDate);
  }

  /**
   * Formatar duração
   */
  formatDuration(startDate: Date, endDate?: Date): string {
    return CurriculumUtils.formatDuration(startDate, endDate);
  }

  /**
   * Parsear array de responsabilidades/tecnologias
   */
  parseArray(jsonString?: string): string[] {
    return CurriculumUtils.parseStringArray(jsonString);
  }

  /**
   * Download do CV
   */
  downloadCV() {
    this.curriculumService.getCurriculumData().subscribe({
      next: (data) => {
        if (data) {
          // Criar link temporário para download
          const link = document.createElement('a');
          link.href = data.Data[0].PersonalInfo.GuidID ?? "";
          link.download = 'CV-Aldrin-Ronchi.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Se não houver URL, abrir janela para impressão
          window.print();
        }
      },
      error: (error) => {
        console.error('Erro ao gerar CV:', error);
        // Fallback para impressão
        window.print();
      }
    });
  }

  /**
   * Navegar para seção
   */
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Abrir link externo
   */
  openExternalLink(url?: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  /**
   * Verificar se está carregando qualquer seção
   */
  isLoading(): boolean {
    return Object.values(this.loading).some(loading => loading);
  }

  /**
   * Obter ícone da categoria de habilidade
   */
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      frontend: 'fas fa-code',
      backend: 'fas fa-server',
      database: 'fas fa-database',
      tools: 'fas fa-tools',
      mobile: 'fas fa-mobile-alt',
      devops: 'fas fa-cloud',
      other: 'fas fa-cog'
    };
    return icons[category] || 'fas fa-code';
  }

  /**
   * Obter título amigável da categoria
   */
  getCategoryTitle(category: string): string {
    const titles: { [key: string]: string } = {
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Database',
      tools: 'Ferramentas',
      mobile: 'Mobile',
      devops: 'DevOps',
      other: 'Outros'
    };
    return titles[category] || category;
  }

  /**
   * Obter tecnologias da experiência como array
   */
  getExperienceTechnologies(experience: Experience): string[] {
    if (experience.Technologies) {
      return CurriculumUtils.parseStringArray(experience.Technologies);
    }
    return [];
  }

  /**
   * Obter conquistas da experiência como array
   */
  getExperienceAchievements(experience: Experience): string[] {
    if (experience.Achievements) {
      return CurriculumUtils.parseStringArray(experience.Achievements);
    }
    return [];
  }

  /**
   * Verificar se certificação está válida
   */
  isCertificationValid(certification: Certification): boolean {
    if (!certification.ExpiryDate) return true;
    return new Date(certification.ExpiryDate) > new Date();
  }

  /**
   * Formatar data de certificação
   */
  formatCertificationDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Gerar URL do Google Maps para localização
   */
  getGoogleMapsUrl(location?: string): string {
    if (!location) {
      return '#';
    }
    return `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
  }

  /**
   * Verificar se uma categoria tem mais de 4 skills (para layout em 2 colunas)
   */
  shouldUseTwoColumns(category: string): boolean {
    return this.getSkillsByCategory(category).length > 4;
  }

  /**
   * Dividir skills em duas colunas para melhor layout
   */
  getSkillsInColumns(category: string): { left: Skill[], right: Skill[] } {
    const skills = this.getSkillsByCategory(category);
    const middle = Math.ceil(skills.length / 2);
    
    return {
      left: skills.slice(0, middle),
      right: skills.slice(middle)
    };
  }
}
