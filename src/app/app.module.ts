import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { FooterBarComponent } from './Components/footer-bar/footer-bar.component';
import { ModalInfoComponent } from './Pages/projects/modal-info/modal-info.component';
import { HomeComponent } from './Pages/home/home.component';
import { ProjectsComponent } from './Pages/projects/projects.component';
import { CurriculumComponent } from './Pages/curriculum/curriculum.component';
import { ContactComponent } from './Pages/contact/contact.component';
import { LoginComponent } from './Pages/login/login.component';
import { IntegrationTestComponent } from './Pages/integration-test/integration-test.component';
import { AdminDashboardComponent } from './Pages/admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from './Pages/not-found/not-found.component';

// Interceptors
import { TokenInterceptorService } from './shared/interceptors/token-interceptor.service';
import { ErrorHandlerService } from './shared/interceptors/error-handler.service';
import { LoadingInterceptor } from './shared/interceptors/loading-interceptor.service';

// Shared Components
import { LoadingComponent } from './shared/loading/loading.component';

// Admin Dashboard Components
import { ProjectFormModalComponent } from './Pages/admin-dashboard/components/project-form-modal/project-form-modal.component';
import { CurriculumFormModalComponent } from './Pages/admin-dashboard/components/curriculum-form-modal/curriculum-form-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterBarComponent,
    ModalInfoComponent,
    ProjectsComponent,
    HomeComponent,
    CurriculumComponent,
    ContactComponent,
    LoginComponent,
    IntegrationTestComponent,
    AdminDashboardComponent,
    NotFoundComponent,
    LoadingComponent,
    ProjectFormModalComponent,
    CurriculumFormModalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
