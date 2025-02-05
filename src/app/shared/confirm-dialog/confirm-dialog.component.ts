import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {


  constructor (
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}



    confirm(): void {
      this.dialogRef.close(true); // Close dialog and return true
    }

  cancel(): void {
    this.dialogRef.close(false); // Close dialog and return false
  }

 
}

