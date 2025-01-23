import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostTaskComponent } from './components/post-task/post-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DemoAngularMaterialModule } from 'src/app/demo-angular-material.module';
import { UpdateTaskComponent } from './components/update-task/update-task.component';
import { ViewTaskDetailsComponent } from './components/view-task-details/view-task-details.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    PostTaskComponent,
    UpdateTaskComponent,
    ViewTaskDetailsComponent,
    MainDashboardComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DemoAngularMaterialModule,
    NgChartsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule,
]
})
export class AdminModule { }
