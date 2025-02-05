import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/services/admin.service';


@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent {


  id: number = this.route.snapshot.params['id'];

  updateTaskForm !: FormGroup;
  listofEmployees: any = [];
  listOfPriorities: any = ["LOW", "HIGH", "MEDIUM","VERY-HIGH","VERY-LOW"];
  listOfTaskStatus: any = ["PENDING", "INPROGRESS", "COMPLETED", "DEFERRED", "CANCELLED"];
  
  constructor(
    private dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },


    private service: AdminService
    , private route: ActivatedRoute,
     private fb: FormBuilder,
     private snackbar:MatSnackBar,
     private router:Router) {}

  ngOnInit() {
    this.updateTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      taskStatus: [null, [Validators.required]]

    })
    this.service.getTaskById(this.data.id).subscribe((res) => {
      this.updateTaskForm.patchValue(res);
      this.getusers();
    });
  }
  getTaskById() {
    this.service.getTaskById(this.id).subscribe((res) => {
      console.log(res);
      this.getusers();
      this.updateTaskForm.patchValue(res);
    })
  }

  getusers() {
    this.service.getUsers().subscribe((res) => {
      this.listofEmployees = res;
      console.log(res);
    })
  }
  closeDialog(){
    this.dialogRef.close(true); 
  }
  updateTask(){
    if (this.updateTaskForm.invalid) {
      this.snackbar.open('Please fill out all required fields', 'Close', { duration: 5000 });
      return;
    }

    this.service.updateTask(this.data.id, this.updateTaskForm.value).subscribe({
      next: () => {
        this.snackbar.open('Task updated successfully', 'Close', { duration: 5000 });
        this.dialogRef.close(true); // Close dialog and indicate success
      },
      error: () => {
        this.snackbar.open('Failed to update task', 'Close', { duration: 5000 });
      },
    });
  }

  

}
