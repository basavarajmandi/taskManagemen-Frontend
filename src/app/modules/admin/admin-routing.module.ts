import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostTaskComponent } from './components/post-task/post-task.component';
import { UpdateTaskComponent } from './components/update-task/update-task.component';
import { ViewTaskDetailsComponent } from './components/view-task-details/view-task-details.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';

const routes: Routes = [
  {path:"Maindashboard",component:MainDashboardComponent ,data: { hideFooter: true }},
  {path:"dashboard" ,component:DashboardComponent},
  {path:"task",component:PostTaskComponent ,data: { hideFooter: true }},
 
  {path:"task/:id/edit",component:UpdateTaskComponent},
  {path:"task/:id/view",component:ViewTaskDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
