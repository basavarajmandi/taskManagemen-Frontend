import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { DemoAngularMaterialModule } from './demo-angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { AboutCompanyComponent } from './auth/components/about-company/about-company.component';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
  AboutCompanyComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoAngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    NgChartsModule, 
    MatFormFieldModule,
   
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
