import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  PersonalInfo, 
  Skill, 
  Experience, 
  Education, 
  Certification, 
  Service,
  CurriculumData,
  SkillCategory
} from '../../models/curriculum.model';
import { AppConstants } from '../constants/app.constants';
import { RequestViewModel } from 'src/app/models/request.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {

  constructor(private apiService: ApiService) { }

  // ===== PERSONAL INFO =====
  
  /**
   * Obter informações pessoais
   */
  getPersonalInfo(): Observable<RequestViewModel<PersonalInfo>> {
    return this.apiService.get<RequestViewModel<PersonalInfo>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.PERSONAL_INFO.BASE}`
    );
  }

  /**
   * Criar informações pessoais
   */
  createPersonalInfo(personalInfo: Omit<PersonalInfo, 'ID' | 'UserID'>): Observable<RequestViewModel<PersonalInfo>> {
    return this.apiService.post<RequestViewModel<PersonalInfo>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.PERSONAL_INFO.BASE}`,
      personalInfo
    );
  }

  /**
   * Atualizar informações pessoais
   */
  updatePersonalInfo(personalInfo: Partial<PersonalInfo> & { ID: number }): Observable<RequestViewModel<PersonalInfo>> {
    return this.apiService.put<RequestViewModel<PersonalInfo>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.PERSONAL_INFO.BASE}`,
      personalInfo
    );
  }

  // ===== SKILLS =====

  /**
   * Obter todas as habilidades
   */
  getSkills(): Observable<RequestViewModel<Skill>> {
    return this.apiService.get<RequestViewModel<Skill>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.SKILLS.BASE}`
    );
  }

  /**
   * Criar nova habilidade
   */
  createSkill(skill: Omit<Skill, 'ID' | 'UserID'>): Observable<RequestViewModel<Skill>> {
    return this.apiService.post<RequestViewModel<Skill>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.SKILLS.BASE}`,
      skill
    );
  }

  /**
   * Atualizar habilidade existente
   */
  updateSkill(skill: Partial<Skill> & { ID: number }): Observable<RequestViewModel<Skill>> {
    return this.apiService.put<RequestViewModel<Skill>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.SKILLS.BASE}`,
      skill
    );
  }

  /**
   * Excluir habilidade
   */
  deleteSkill(skillId: number): Observable<RequestViewModel<Skill>> {
    return this.apiService.delete<RequestViewModel<Skill>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.SKILLS.BASE}/${skillId}`
    );
  }

  /**
   * Obter habilidades por categoria
   */
  getSkillsByCategory(category: SkillCategory): Observable<RequestViewModel<Skill>> {
    return this.getSkills().pipe(
      map(response => ({
        ...response,
        Data: response.Data.filter(skill => skill.Category === category)
      }))
    );
  }

  // ===== EXPERIENCES =====

  /**
   * Obter experiências profissionais
   */
  getExperiences(): Observable<RequestViewModel<Experience>> {
    return this.apiService.get<RequestViewModel<Experience>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.EXPERIENCES.BASE}`
    );
  }

  /**
   * Criar nova experiência
   */
  createExperience(experience: Omit<Experience, 'ID' | 'UserID'>): Observable<RequestViewModel<Experience>> {
    return this.apiService.post<RequestViewModel<Experience>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.EXPERIENCES.BASE}`,
      experience
    );
  }

  /**
   * Atualizar experiência existente
   */
  updateExperience(experience: Partial<Experience> & { ID: number }): Observable<RequestViewModel<Experience>> {
    return this.apiService.put<RequestViewModel<Experience>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.EXPERIENCES.BASE}`,
      experience
    );
  }

  /**
   * Excluir experiência
   */
  deleteExperience(experienceId: number): Observable<RequestViewModel<Experience>> {
    return this.apiService.delete<RequestViewModel<Experience>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.EXPERIENCES.DELETE}/${experienceId}`
    );
  }

  // ===== EDUCATION =====

  /**
   * Obter educação
   */
  getEducation(): Observable<RequestViewModel<Education>> {
    return this.apiService.get<RequestViewModel<Education>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.EDUCATION.BASE}`
    );
  }

  /**
   * Criar nova educação
   */
  createEducation(education: Omit<Education, 'ID' | 'UserID'>): Observable<RequestViewModel<Education>> {
    return this.apiService.post<RequestViewModel<Education>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.EDUCATION.BASE}`,
      education
    );
  }

  /**
   * Atualizar educação existente
   */
  updateEducation(education: Partial<Education> & { ID: number }): Observable<RequestViewModel<Education>> {
    return this.apiService.put<RequestViewModel<Education>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.EDUCATION.BASE}`,
      education
    );
  }

  /**
   * Excluir educação
   */
  deleteEducation(educationId: number): Observable<RequestViewModel<Education>> {
    return this.apiService.delete<RequestViewModel<Education>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.EDUCATION.BASE}/${educationId}`
    );
  }

  // ===== CERTIFICATIONS =====

  /**
   * Obter certificações
   */
  getCertifications(): Observable<RequestViewModel<Certification>> {
    return this.apiService.get<RequestViewModel<Certification>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.CERTIFICATIONS.BASE}`
    );
  }

  /**
   * Criar nova certificação
   */
  createCertification(certification: Omit<Certification, 'ID' | 'UserID'>): Observable<RequestViewModel<Certification>> {
    return this.apiService.post<RequestViewModel<Certification>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.CERTIFICATIONS.BASE}`,
      certification
    );
  }

  /**
   * Atualizar certificação existente
   */
  updateCertification(certification: Partial<Certification> & { ID: number }): Observable<RequestViewModel<Certification>> {
    return this.apiService.put<RequestViewModel<Certification>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.CERTIFICATIONS.BASE}`,
      certification
    );
  }

  /**
   * Excluir certificação
   */
  deleteCertification(certificationId: number): Observable<RequestViewModel<Certification>> {
    return this.apiService.delete<RequestViewModel<Certification>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.CERTIFICATIONS.BASE}/${certificationId}`
    );
  }

  // ===== SERVICES =====

  /**
   * Obter serviços
   */
  getServices(): Observable<RequestViewModel<Service>> {
    return this.apiService.get<RequestViewModel<Service>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.SERVICES.BASE}`
    );
  }

  /**
   * Criar novo serviço
   */
  createService(service: Omit<Service, 'ID' | 'UserID'>): Observable<RequestViewModel<Service>> {
    return this.apiService.post<RequestViewModel<Service>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.SERVICES.BASE}`,
      service
    );
  }

  /**
   * Atualizar serviço existente
   */
  updateService(service: Partial<Service> & { ID: number }): Observable<RequestViewModel<Service>> {
    return this.apiService.put<RequestViewModel<Service>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.SERVICES.BASE}`,
      service
    );
  }

  /**
   * Excluir serviço
   */
  deleteService(serviceId: number): Observable<RequestViewModel<Service>> {
    return this.apiService.delete<RequestViewModel<Service>>(
      `${AppConstants.API_ENDPOINTS.CURRICULUM.BASE}/${AppConstants.API_ENDPOINTS.CURRICULUM.SERVICES.BASE}/${serviceId}`
    );
  }

  // ===== CURRICULUM DATA =====

  /**
   * Obter dados completos do currículo
   */
  getCurriculumData(): Observable<RequestViewModel<CurriculumData>> {
    return new Observable(observer => {
      let completedRequests = 0;
      const totalRequests = 6;
      const curriculumData: CurriculumData = {
        PersonalInfo: {} as PersonalInfo,
        Skills: [],
        Experiences: [],
        Education: [],
        Certifications: [],
        Services: []
      };

      const checkCompletion = () => {
        completedRequests++;
        if (completedRequests === totalRequests) {
          observer.next({
            Data: [curriculumData],
            Type: 'CurriculumData',
            PageCount: 1,
            Message: 'Dados do currículo carregados com sucesso'
          });
          observer.complete();
        }
      };

      // Buscar informações pessoais
      this.getPersonalInfo().subscribe({
        next: (response) => {
          if (response.Data && response.Data.length > 0) {
            curriculumData.PersonalInfo = response.Data[0];
          }
          checkCompletion();
        },
        error: () => checkCompletion()
      });

      // Buscar habilidades
      this.getSkills().subscribe({
        next: (response) => {
          curriculumData.Skills = response.Data || [];
          checkCompletion();
        },
        error: () => checkCompletion()
      });

      // Buscar experiências
      this.getExperiences().subscribe({
        next: (response) => {
          curriculumData.Experiences = response.Data || [];
          checkCompletion();
        },
        error: () => checkCompletion()
      });

      // Buscar educação
      this.getEducation().subscribe({
        next: (response) => {
          curriculumData.Education = response.Data || [];
          checkCompletion();
        },
        error: () => checkCompletion()
      });

      // Buscar certificações
      this.getCertifications().subscribe({
        next: (response) => {
          curriculumData.Certifications = response.Data || [];
          checkCompletion();
        },
        error: () => checkCompletion()
      });

      // Buscar serviços
      this.getServices().subscribe({
        next: (response) => {
          curriculumData.Services = response.Data || [];
          checkCompletion();
        },
        error: () => checkCompletion()
      });
    });
  }

  /**
   * Obter estatísticas do currículo
   */
  getCurriculumStats(): Observable<any> {
    return this.getCurriculumData().pipe(
      map(response => {
        if (response.Data && response.Data.length > 0) {
          const data = response.Data[0];
          return {
            totalSkills: data.Skills.length,
            totalExperiences: data.Experiences.length,
            totalEducation: data.Education.length,
            totalCertifications: data.Certifications.length,
            totalServices: data.Services.length,
            hasPersonalInfo: !!data.PersonalInfo.Name,
            skillsByCategory: data.Skills.reduce((acc: any, skill) => {
              acc[skill.Category] = (acc[skill.Category] || 0) + 1;
              return acc;
            }, {}),
            averageSkillLevel: data.Skills.length > 0 
              ? data.Skills.reduce((sum, skill) => sum + skill.Level, 0) / data.Skills.length 
              : 0
          };
        }
        return null;
      })
    );
  }

  /**
   * Buscar dados do currículo
   */
  searchCurriculumData(query: string): Observable<any> {
    return this.getCurriculumData().pipe(
      map(response => {
        if (!response.Data || response.Data.length === 0) return [];
        
        const data = response.Data[0];
        const results: any[] = [];
        const searchTerm = query.toLowerCase();

        // Buscar nas habilidades
        data.Skills.filter(skill => 
          skill.Name.toLowerCase().includes(searchTerm) ||
          skill.Category.toLowerCase().includes(searchTerm)
        ).forEach(skill => {
          results.push({
            type: 'skill',
            title: skill.Name,
            description: `Habilidade - ${skill.Category} (${skill.Level}%)`,
            data: skill
          });
        });

        // Buscar nas experiências
        data.Experiences.filter(exp => 
          exp.Title.toLowerCase().includes(searchTerm) ||
          exp.Company.toLowerCase().includes(searchTerm) ||
          (exp.Description && exp.Description.toLowerCase().includes(searchTerm))
        ).forEach(exp => {
          results.push({
            type: 'experience',
            title: exp.Title,
            description: `${exp.Company} - Experiência Profissional`,
            data: exp
          });
        });

        // Buscar na educação
        data.Education.filter(edu => 
          edu.Degree.toLowerCase().includes(searchTerm) ||
          edu.Institution.toLowerCase().includes(searchTerm)
        ).forEach(edu => {
          results.push({
            type: 'education',
            title: edu.Degree,
            description: `${edu.Institution} - Educação`,
            data: edu
          });
        });

        return results;
      })
    );
  }
} 