import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UpdateDialogComponent } from 'src/app/shared/components/update-dialog/update-dialog.component';
//import { TaskDTO } from 'src/app/shared/models/task-dto';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent {

  isFilterPanelOpen: any;
  isPanelExpanded = false; 
  listOfTasks: any = []
  //overdueTasks:TaskDTO[]=[]  //Define overdueTasks as an array of TaskDTOs
  searchTaskForm!: FormGroup;

  constructor(private service: AdminService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog,
  private router: Router) { }

  ngOnInit() {
    this.searchTaskForm = this.fb.group({
      title: [null],
      priority: [null],
      dueDate: [null],
      taskStatus: [null],
      employeeName:[null]
    });
    this.getTask();
    this.applyFilter();
    this.filterOverdueTasks();
   
  }
  getTask() {
    this.service.getAllTask().subscribe((res) => {
      this.listOfTasks = res;
    })
  }

  // Open the confirmation dialog before deleting a task
  deleteTask(taskId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      position: { top: '30px', right: '500px' },  // Adjust top and right as needed
      width: '500px'

    }); 
    // Open the confirmation dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // If user confirmed (result is true)
        this.service.deleteTask(taskId).subscribe((res) => {
          this.snackbar.open("Task deleted successfully!", "Close", { duration: 5000 });
          this.getTask(); // Reload the task list after deletion
        });
      }
    });
  }

  
  searchTask() {
    const title = this.searchTaskForm.get('title')!.value;
    console.log(title);
    this.service.searchTask(title).subscribe((res) => {
      console.log(res);
      this.listOfTasks = res;
    })
  }

  // Apply filter to tasks
  applyFilter(): void {
    const formValues = this.searchTaskForm.value;
    const title: string | undefined = formValues.title || undefined;
    const priority: string | undefined = formValues.priority || undefined;
    const employeeName:string | undefined = formValues.employeeName || undefined;

   // Ensure dueDate is sent in YYYY-MM-DD format to match backend expectations
   const dueDate: string | undefined = formValues.dueDate? new Date(formValues.dueDate.getTime() - new Date().getTimezoneOffset() * 60000)
       .toISOString()
       .split('T')[0]
   : undefined;
    const taskStatus: string | undefined = formValues.taskStatus || undefined;
    console.log('Filter values:', { title, priority, dueDate, taskStatus,employeeName });
    this.service.filterTasks(priority, title, dueDate,taskStatus,employeeName).subscribe(
      (res) => {
        this.listOfTasks = res;
        console.log('Filtered Tasks:', res);
      },
      (err) => {
        console.error('Error applying filters:', err);
        this.snackbar.open('Error applying filters. Please try again!', 'Close', { duration: 5000 });
      }
    );
  }

  clearFilter(): void {
    this.searchTaskForm.reset();
    this.getTask();
  }
  


  onTaskDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.listOfTasks, event.previousIndex, event.currentIndex);
    console.log('Tasks reordered:', this.listOfTasks);
  }
  
  openUpdateTaskDialog(taskId: number){
     const dalogRef =this.dialog.open(UpdateDialogComponent,{
      width:'500px',
      data:{id:taskId},
     });
     dalogRef.afterClosed().subscribe(result=>{
      console.log(`dialog result:${result}`)
      this.getTask();
  
     })

  }


  filterOverdueTasks():void{
    this.service.getAllOverdueTask().subscribe((Task)=>{
      //this.overdueTasks=Task;
      this.listOfTasks = Task;
      console.log(Task);
    },(error)=>{
      console.error('Error loading overdue tasks',error);
    })
  }
}
