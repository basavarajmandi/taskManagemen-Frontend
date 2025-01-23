import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DemoAngularMaterialModule } from 'src/app/demo-angular-material.module';
import { UpdateDialogComponent } from './components/update-dialog/update-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [ConfirmDialogComponent,
     UpdateDialogComponent, 
     FooterComponent,
  ],
  imports: [
    CommonModule,
    DemoAngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,

  ],
   exports: [ConfirmDialogComponent,
    UpdateDialogComponent,
    FooterComponent,  // Export FooterComponent to use in other modules
   ]
})
export class SharedModule { }
