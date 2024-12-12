import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DemoAngularMaterialModule } from 'src/app/demo-angular-material.module';


@NgModule({
  declarations: [ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    DemoAngularMaterialModule
  ],
   exports: [ConfirmDialogComponent]
})
export class SharedModule { }
