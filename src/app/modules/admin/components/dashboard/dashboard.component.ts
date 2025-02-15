import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UpdateDialogComponent } from 'src/app/shared/components/update-dialog/update-dialog.component';
import { Observable } from 'rxjs';
import { TaskDTO } from 'src/app/shared/models/task-dto';
import * as moment from 'moment';


//import { TaskDTO } from 'src/app/shared/models/task-dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent {

  isFilterPanelOpen: any;
  isPanelExpanded = false;
  listOfTasks: any = [];
  //overdueTasks:TaskDTO[]=[]  //Define overdueTasks as an array of TaskDTOs
  searchTaskForm!: FormGroup;
  isLoading: boolean = false;
  selectedFilter: string = '';
  startDate!: Date;
  endDate!: Date;

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
      employeeName: [null]
    });
    this.getTask();
    this.applyFilter();
    this.filterOverdueTasks();

  }
  getTask(): void {
    this.isLoading = true;
    this.service.getAllTask().subscribe({

      next: (tasks: any) => {

        // Add "time ago" calculation here
        this.listOfTasks = tasks.map((task: any) => ({
          ...task,
          timeAgo: this.getTimeAgo(task.assignedDate) // Add a new field `timeAgo`
        }));


        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.isLoading = false;
      }
    });
  }

  getTimeAgo(taskDate: string): string {
    const duration = moment.duration(moment().diff(moment(taskDate)));
    return duration.humanize().replace("a day", "1 day") + " ago";
  }

  filterTasks(filterType: string): void {
    this.isLoading = true;
    this.selectedFilter = filterType;
    let taskObservable: Observable<TaskDTO[]>;
    switch (filterType) {
      case 'today':
        taskObservable = this.service.getTasksDueToday();
        break;
      case 'yesterday':
        taskObservable = this.service.getTasksDueYesterday();
        break;
      case 'thisWeek':
        taskObservable = this.service.getTasksThisWeek();
        break;
      case 'lastWeek':
        taskObservable = this.service.getTasksLastWeek();
        break;
      case 'thisMonth':
        taskObservable = this.service.getTasksThisMonth();
        break;
      case 'lastMonth':
        taskObservable = this.service.getTasksLastMonth();
        break;
      case 'thisYear':
        taskObservable = this.service.getTasksThisYear();
        break;

      case 'custom':
        return;
      default:
        this.getTask();
        return;
    }

    taskObservable.subscribe({
      next: (tasks) => {
        // Apply timeAgo calculation here as well
        this.listOfTasks = tasks.map((task: any) => ({
          ...task,
          timeAgo: this.getTimeAgo(task.assignedDate)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching filtered tasks:", err);
        this.isLoading = false;
      }
    });
  }
  toggleCustomFilter(): void {
    this.selectedFilter = 'custom';
  }

  applyCustomFilter(): void {
    if (!this.startDate || !this.endDate) {
      this.snackbar.open("Please select both start and end dates.", "Close", { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.service.getTasksByCustomRange(this.startDate, this.endDate).subscribe({
      next: (tasks) => {
        this.listOfTasks = tasks.map((task: any) => ({
          ...task,
          timeAgo: this.getTimeAgo(task.assignedDate)
        }));
        this.isLoading = false;
        // Hide the custom date range picker
        this.selectedFilter = ''; // This will close the date picker
      },
      error: (err) => {
        console.error("Error fetching custom range tasks:", err);
        this.isLoading = false;
      }
    });
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

    // const priority: string | undefined = formValues.priority || undefined;
    // Ensure that priority is always an array
    const priority: string[] | undefined =
      formValues.priority && Array.isArray(formValues.priority) ? formValues.priority :
        formValues.priority ? [formValues.priority] : undefined;

    // const taskStatus: string | undefined = formValues.taskStatus || undefined;
    // Ensure that taskStatus is always an array
    const taskStatus: string[] | undefined =
      formValues.taskStatus && Array.isArray(formValues.taskStatus) ? formValues.taskStatus :
        formValues.taskStatus ? [formValues.taskStatus] : undefined;

    const employeeName: string | undefined = formValues.employeeName || undefined;
    // Ensure dueDate is sent in YYYY-MM-DD format to match backend expectations
    // Ensure dueDate is correctly formatted (yyyy-MM-dd) without timezone shifts
    const dueDate: string | undefined = formValues.dueDate
      ? this.formatDateWithoutTimezone(new Date(formValues.dueDate))
      : undefined;


    console.log('Filter values:', { title, priority, dueDate, taskStatus, employeeName });
    this.service.filterTasks(priority, title, dueDate, taskStatus, employeeName).subscribe(
      (res) => {
       this.listOfTasks = res.map((task: any) => ({
        ...task,
        timeAgo: this.getTimeAgo(task.assignedDate)  // Apply time ago conversion
      }));
        console.log('Filtered Tasks:', res);
      },
      (err) => {
        console.error('Error applying filters:', err);
        this.snackbar.open('Error applying filters. Please try again!', 'Close', { duration: 5000 });
      }
    );
  }

  // Helper function to format date correctly (yyyy-MM-dd)
  formatDateWithoutTimezone(date: Date): string {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  clearFilter(): void {
    this.searchTaskForm.reset();
    this.getTask();
  }


  onTaskDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.listOfTasks, event.previousIndex, event.currentIndex);
    console.log('Tasks reordered:', this.listOfTasks);
  }

  openUpdateTaskDialog(taskId: number) {
    const dalogRef = this.dialog.open(UpdateDialogComponent, {
      width: '500px',
      data: { id: taskId },
    });
    dalogRef.afterClosed().subscribe(result => {
      console.log(`dialog result:${result}`)
      this.getTask();

    })
  }

  filterOverdueTasks(): void {
    this.service.getAllOverdueTask().subscribe((Task) => {
      //this.overdueTasks=Task;
      this.listOfTasks = Task;
      console.log(Task);
    }, (error) => {
      console.error('Error loading overdue tasks', error);
    })
  }
}
