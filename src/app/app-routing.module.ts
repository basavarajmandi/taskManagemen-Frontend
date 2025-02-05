import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { AboutCompanyComponent } from './auth/components/about-company/about-company.component';
import { ViewTaskTableComponent } from './shared/view-task-table/view-task-table.component';

const routes: Routes = [
  {path:"login", component:LoginComponent , data: { hideFooter: true }}, //
  {path:"signup",component:SignupComponent ,data:{hideFooter:true}},//
  {path:"about", component:AboutCompanyComponent,data:{hideFooter:true}},
  {path:"Admin-view-table",component:ViewTaskTableComponent},
  {path:"admin",loadChildren:()=>import("./modules/admin/admin.module").then(e=>e.AdminModule)},
  {path:"employee",loadChildren:()=>import("./modules/employee/employee.module").then(e=>e.EmployeeModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
