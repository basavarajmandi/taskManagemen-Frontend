import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  listOfTasks: any =[]
  searchTaskForm!: FormGroup;
  constructor(private service:AdminService,
    private snackbar: MatSnackBar,
    private fb:FormBuilder,
    private dialog: MatDialog ){}

  ngOnInit() {
    this.searchTaskForm = this.fb.group({
      title: [null]
    })
    this.getTask();
  }
  
  getTask(){
    this.service.getAllTask().subscribe((res)=>{
      this.listOfTasks=res;
    })
  }

  
//   deleteTask(id:number){
// this.service.deleteTask(id).subscribe((res)=>{
// this.snackbar.open("Task delete successfully..","close",{duration:5000});
// this.getTask();
// })
//   }

 // Open the confirmation dialog before deleting a task
 deleteTask(taskId: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent,{
     position: { top: '30px', right: '500px' },  // Adjust top and right as needed
    width: '500px'

  }); // Open the confirmation dialog

  dialogRef.afterClosed().subscribe(result => {
    if (result) { // If user confirmed (result is true)
      this.service.deleteTask(taskId).subscribe((res) => {
        this.snackbar.open("Task deleted successfully!", "Close", { duration: 5000 });
        this.getTask(); // Reload the task list after deletion
      });
    }
  });
}

  searchTask(){
    const title =this.searchTaskForm.get('title')!.value;
    console.log(title);
    this.service.searchTask(title).subscribe((res)=>{
      console.log(res);
      this.listOfTasks=res;
    })
  }
}
