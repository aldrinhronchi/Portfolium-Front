import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { CurriculumComponent } from './pages/curriculum/curriculum.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ModalInfoComponent } from './pages/projects/modal-info/modal-info.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterBarComponent,
    HomeComponent,
    CurriculumComponent,
    ContactComponent,
    ProjectsComponent,
    ModalInfoComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
