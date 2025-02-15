import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DemoAngularMaterialModule } from 'src/app/demo-angular-material.module';
import { UpdateDialogComponent } from './components/update-dialog/update-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';

@NgModule({
  declarations: [
     ConfirmDialogComponent,
     UpdateDialogComponent, 
     FooterComponent, 
     CategoryDialogComponent,
  ],
  imports: [
    CommonModule,
    DemoAngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  
  ],
  
   exports: [
    ConfirmDialogComponent,
    UpdateDialogComponent,
    FooterComponent, 
    CategoryDialogComponent// Export this all components to use in other modules
 
   ]
})
export class SharedModule { }
