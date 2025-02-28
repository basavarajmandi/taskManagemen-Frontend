import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-link-dialog',
  templateUrl: './add-link-dialog.component.html',
  styleUrls: ['./add-link-dialog.component.scss']
})
export class AddLinkDialogComponent {    


  linkForm: FormGroup;
//   newLink: string = '';
  links: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { links: string[] }
  ) {
    this.links = [...data.links];

    this.linkForm = new FormGroup({
      newLink: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/)?([\w\d@#.-]+\.)+[a-zA-Z]{2,6}(\/.*)?$/)
            ])
    });
  }

  addLink(): void {
    if (this.linkForm.valid) {
      this.links.push(this.linkForm.value.newLink);
      this.linkForm.reset(); // Reset form after adding link
    } else {
      this.linkForm.get('newLink')?.markAsTouched();
    }
  }
  removeLink(index: number): void {
    this.links.splice(index, 1);
  }

  saveLinks(): void {
    this.dialogRef.close(this.links);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
