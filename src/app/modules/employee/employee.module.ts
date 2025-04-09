import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoAngularMaterialModule } from 'src/app/demo-angular-material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewTaskDetailsComponent } from './components/view-task-details/view-task-details.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmployeminiDashboardComponent } from './components/employemini-dashboard/employemini-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from "../../shared/shared.module";
import { EmployeeTaskTableComponent } from 'src/app/shared/employee-task-table/employee-task-table.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ViewTaskDetailsComponent,
    EmployeminiDashboardComponent,
    EmployeeTaskTableComponent

  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DemoAngularMaterialModule,
    MatPaginatorModule,
    NgChartsModule,
    SharedModule]
})
export class EmployeeModule { }
