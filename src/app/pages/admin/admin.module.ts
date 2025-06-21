import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ProjectFormModalComponent } from '../admin-dashboard/components/project-form-modal/project-form-modal.component';
import { CurriculumFormModalComponent } from '../admin-dashboard/components/curriculum-form-modal/curriculum-form-modal.component';

@NgModule({
  declarations: [
    LoginComponent,
    AdminDashboardComponent,
    NotFoundComponent,
    ProjectFormModalComponent,
    CurriculumFormModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: AdminDashboardComponent }
    ])
  ],
  exports: [
    LoginComponent,
    AdminDashboardComponent,
    NotFoundComponent
  ]
})
export class AdminModule { } 