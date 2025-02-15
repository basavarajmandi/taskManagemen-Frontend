import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';


@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent {

  id: number = this.route.snapshot.params['id'];
  updateTaskForm !: FormGroup;
  listofEmployees: any = [];
  listOfPriorities: any = ["LOW", "HIGH", "MEDIUM", "VERY-HIGH", "VERY-LOW"];
  listOfTaskStatus: any = ["PENDING", "INPROGRESS", "COMPLETED", "DEFERRED", "CANCELLED"];

  listOfCategories: any = [];
  selectedCategoryName: string = ''; // Store selected category name

  constructor(
    private dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },

    private service: AdminService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.updateTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      taskStatus: [null, [Validators.required]],
      //categoryId: [null, Validators.required] // Add categoryId field
      categoryId: [null], // Allow null if new category is added
      categoryName: ['']   // Add categoryName field for new category

    })
    this.service.getTaskById(this.data.id).subscribe((res) => {
      this.updateTaskForm.patchValue(res);
      this.getCategories();
      this.selectedCategoryName = res.categoryName; // Set initial category name
      this.getusers();

    });
  }
  getTaskById() {
    this.service.getTaskById(this.id).subscribe((res) => {
      console.log(res);
      this.getusers();
      this.getCategories();
      this.updateTaskForm.patchValue(res);
    })
  }

  getusers() {
    this.service.getUsers().subscribe((res) => {
      this.listofEmployees = res;
      console.log(res);
    })
  }

  getCategories() {
    this.service.getCategories().subscribe((res) => {
      this.listOfCategories = res;
    });
  }

   // Open category dialog
   openCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { categories: this.listOfCategories }
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.updateTaskForm.patchValue({ categoryId: result.categoryId });
    //     this.selectedCategoryName = result.categoryName; // Update UI
    //   }
    // });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.categoryId) {
          this.updateTaskForm.patchValue({ categoryId: result.categoryId, categoryName: '' });
          this.selectedCategoryName = result.categoryName;
        } else if (result.categoryName) {
          this.updateTaskForm.patchValue({ categoryId: null, categoryName: result.categoryName });
          this.selectedCategoryName = result.categoryName;
        }
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }


  updateTask() {
    if (this.updateTaskForm.invalid) {
      this.snackbar.open('Please fill out all required fields', 'Close', { duration: 5000 });
      return;
    }
    const formValue = this.updateTaskForm.value;
    // Ensure dueDate is formatted properly before sending to backend
    let formattedDueDate = null;
    if (formValue.dueDate) {
      const dueDate = new Date(formValue.dueDate);
      formattedDueDate = dueDate.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }
  
    const taskUpdateData = {
      ...formValue,
      dueDate: formattedDueDate, // Ensure dueDate is correctly formatted
      categoryId: formValue.categoryId || null,
      categoryName: formValue.categoryName || null
    };

    this.service.updateTask(this.data.id, taskUpdateData).subscribe({
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
