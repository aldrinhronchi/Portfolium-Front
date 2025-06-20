import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService
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

    this.authService.login(testCredentials).subscribe({
      next: (response) => {
        this.addTestResult(
          'Teste de Login',
          response.success ? 'Sucesso' : 'Falhou',
          response.message
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
} 