import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewTaskDetailsComponent } from './components/view-task-details/view-task-details.component';
import { EmployeminiDashboardComponent } from './components/employemini-dashboard/employemini-dashboard.component';

const routes: Routes = [
  {path:"Maindashboard",component:EmployeminiDashboardComponent,data :{hideFooter:true} },
 {path:"dashboard" ,component:DashboardComponent},
 {path:"task-details/:id",component:ViewTaskDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
