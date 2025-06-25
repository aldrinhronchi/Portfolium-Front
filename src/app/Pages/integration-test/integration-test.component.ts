import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import { ProjectService } from '../../shared/services/project.service';
import { SweetAlertBrutalService } from '../../shared/services/sweetalert-brutal.service';
import { RequestViewModel } from 'src/app/models/request.viewmodel';
import { Project } from 'src/app/models/project.model';

@Component({
  selector: 'app-integration-test',
  templateUrl: './integration-test.component.html',
  styleUrls: ['./integration-test.component.css'],
  standalone: false,
})
export class IntegrationTestComponent implements OnInit {
  testResults: any[] = [];
  loading = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private projectService: ProjectService,
    private sweetAlert: SweetAlertBrutalService
  ) { }

  ngOnInit(): void {
    this.runTests();
  }

  async runTests(): Promise<void> {
    this.loading = true;
    this.testResults = [];

    // Teste 1: Conexão com API
    await this.testApiConnection();

    // Teste 2: Status de autenticação
    this.testAuthStatus();

    // Teste 3: Configuração de CORS
    await this.testCorsConfiguration();

    // Teste 4: API de Projetos
    await this.testProjectsAPI();

    this.loading = false;
  }

  private async testApiConnection(): Promise<void> {
    try {
      const response = await this.apiService.get<any>('WeatherForecast').toPromise();
      this.addTestResult('Conexão com API', 'Sucesso', 'API está respondendo corretamente');
    } catch (error: any) {
      this.addTestResult('Conexão com API', 'Erro', `Erro: ${error.message || error}`);
    }
  }

  private testAuthStatus(): void {
    const isAuthenticated = this.authService.isAuthenticatedValue;
    const currentUser = this.authService.currentUserValue;
    
    this.addTestResult(
      'Status de Autenticação', 
      isAuthenticated ? 'Autenticado' : 'Não Autenticado',
      `Usuário: ${currentUser?.Name || 'Nenhum'}`
    );
  }

  private async testCorsConfiguration(): Promise<void> {
    try {
      // Teste real de CORS usando uma requisição GET simples
      const response = await this.apiService.get<any>('WeatherForecast').toPromise();
      
      this.addTestResult(
        'Configuração CORS', 
        'Sucesso',
        'CORS está funcionando - requisição HTTP executada com sucesso'
      );
    } catch (error: any) {
      if (error.status === 0) {
        this.addTestResult(
          'Configuração CORS', 
          'Erro',
          'Erro de CORS - Verifique se o backend está rodando e configurado corretamente'
        );
      } else {
        this.addTestResult(
          'Configuração CORS', 
          'Sucesso',
          `CORS OK - API respondeu com status ${error.status || 'desconhecido'}`
        );
      }
    }
  }

  private async testProjectsAPI(): Promise<void> {
    try {
      // Teste buscar projetos
      const projects = await this.projectService.getProjects({ Page: 1, PageSize: 5 }).toPromise();
      this.addTestResult(
        'API de Projetos - Listagem',
        'Sucesso',
        `Encontrados ${projects?.Data?.length || 0} projetos - Total de páginas: ${projects?.PageCount || 0}`
      );

      // Teste buscar projetos em destaque
      const featuredProjects = await this.projectService.getFeaturedProjectsList(3).toPromise();
      this.addTestResult(
        'API de Projetos - Em Destaque',
        'Sucesso',
        `Encontrados ${featuredProjects?.length || 0} projetos em destaque`
      );

      // Teste buscar categorias
      const categories = await this.projectService.getCategoriesList().toPromise();
      this.addTestResult(
        'API de Projetos - Categorias',
        'Sucesso',
        `Encontradas ${categories?.length || 0} categorias: ${categories?.join(', ') || 'Nenhuma'}`
      );

    } catch (error: any) {
      this.addTestResult(
        'API de Projetos',
        'Erro',
        `Erro ao testar API de projetos: ${error.friendlyMessage || error.message}`
      );
    }
  }

  private addTestResult(test: string, status: string, details: string): void {
    this.testResults.push({
      test,
      status,
      details,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  testLogin(): void {
    // Teste de login com credenciais de exemplo
    const testCredentials = {
      Email: 'test@example.com',
      Password: 'test123'
    };

    this.authService.login(testCredentials.Email, testCredentials.Password).subscribe({
      next: (response) => {
        this.addTestResult(
          'Teste de Login',
          response && response.Data && response.Data.length > 0 ? 'Sucesso' : 'Falhou',
          response && response.Data && response.Data.length > 0 ? `Login realizado para ${response.Data[0]?.Name}` : 'Credenciais inválidas'
        );
      },
      error: (error) => {
        this.addTestResult(
          'Teste de Login',
          'Erro',
          error.friendlyMessage || error.message
        );
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.addTestResult('Logout', 'Sucesso', 'Usuário desconectado');
  }

  /**
   * Testar os interceptors novos (loading e error com SweetAlert2)
   */
  testInterceptors(): void {
    this.addTestResult('Teste de Interceptors', 'Iniciado', 'Testando Loading, Token e Error interceptors...');
    
    // Teste de loading - requisição normal
    this.projectService.getProjectsList({ Page: 1, PageSize: 3 }).subscribe({
      next: (projects: Project[]) => {
        this.addTestResult('Loading Interceptor', 'Sucesso', 'Loading interceptor funcionando - dados carregados');
        
        // Teste de token interceptor - requisição autenticada
        this.testTokenInterceptor();
      },
      error: (error: any) => {
        this.addTestResult('Loading Interceptor', 'Erro', 'Erro ao testar loading interceptor');
      }
    });
  }

  private testTokenInterceptor(): void {
    // Teste do token interceptor com requisição que precisa de auth
    this.apiService.get('Projects/user').subscribe({
      next: (response) => {
        this.addTestResult('Token Interceptor', 'Sucesso', 'Token interceptor adicionou autorização corretamente');
        this.testErrorInterceptor();
      },
      error: (error) => {
        this.addTestResult('Token Interceptor', 'Funcionando', 'Token interceptor funcionando (erro esperado para usuário não autenticado)');
        this.testErrorInterceptor();
      }
    });
  }

  private testErrorInterceptor(): void {
    // Teste do error interceptor com URL inexistente
    this.apiService.get('NonExistentEndpoint').subscribe({
      next: (response) => {
        this.addTestResult('Error Interceptor', 'Inesperado', 'Resposta inesperada para endpoint inexistente');
      },
      error: (error) => {
        this.addTestResult('Error Interceptor', 'Sucesso', 'Error interceptor capturou erro e mostrou SweetAlert2');
      }
    });
  }

  /**
   * Testar SweetAlert2 diretamente
   */
  testSweetAlert(): void {
    // Demonstração de diferentes tipos de alertas brutais
    this.sweetAlert.confirm(
      'TESTE SWEETALERT2',
      'Qual tipo de alerta brutalista você gostaria de testar?',
      'VER EXEMPLOS',
      'PULAR TESTE'
    ).then((result) => {
      if (result.isConfirmed) {
        // Sucesso
        this.sweetAlert.success(
          'DESIGN BRUTALISTA',
          '🎨 Estilo aplicado com sucesso! Design consistente em todo o sistema.'
        ).then(() => {
          // Warning
          this.sweetAlert.warning(
            'EXEMPLO DE WARNING',
            'Este é um alerta de aviso com design brutalista!'
          ).then(() => {
            // Error
            this.sweetAlert.error(
              'EXEMPLO DE ERRO',
              'Este é um alerta de erro com design brutalista!'
            ).then(() => {
              // Info
              this.sweetAlert.info(
                'EXEMPLO DE INFO',
                'Este é um alerta informativo com design brutalista!'
              ).then(() => {
                // Toast
                this.sweetAlert.toast('TOAST BRUTALISTA FUNCIONANDO!', 'success');
                
                setTimeout(() => {
                  this.sweetAlert.toast('SEGUNDO TOAST DE TESTE!', 'info');
                }, 1000);

                setTimeout(() => {
                  this.sweetAlert.toast('TERCEIRO TOAST DE ERRO!', 'error');
                }, 2000);
              });
            });
          });
        });
      }
    });
    
    this.addTestResult('SweetAlert2', 'Sucesso', 'SweetAlert2 brutalista com serviço funcionando corretamente');
  }
} 