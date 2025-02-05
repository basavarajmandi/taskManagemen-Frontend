import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';  // For general browser support
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { DemoAngularMaterialModule } from './demo-angular-material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { AboutCompanyComponent } from './auth/components/about-company/about-company.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
  AboutCompanyComponent,

  ],
  imports: [
    AppRoutingModule,
     // For general browser functionality
    BrowserAnimationsModule,  // For animations
    DemoAngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    NgChartsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
        // BrowserModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
