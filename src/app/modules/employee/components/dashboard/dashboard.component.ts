import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isFilterPanelOpen: any;
  listOfTasks: any[] = [];
  isPanelExpanded: boolean = false;
  searchTaskForm!: FormGroup;
  categories: string[] = []; // Store categories
  //allCategories: string[] = []; // Store existing category names
  constructor( private fb : FormBuilder,private service:EmployeeService,private snackbar:MatSnackBar){}

  ngOnInit(){
    this.searchTaskForm = this.fb.group({
      priority: [null],
      title: [null],
      taskStatus: [null],
      dueDate: [null],
      categoryNames: [null]  // <-- Added Category Field
    });
    this.getTask();
    this.getAllCategories();
   //this.applyFilter();
  }

getAllCategories(){
  this.service.getAllCategories().subscribe({
    next:(categories) => this.categories = categories,
    error:(err)=>console.error('error fetching categories:',err)
  });
}

getTask() {
  this.service.getFilteredTasksByUserId().subscribe(
    (res) => {
      console.log(res);
            // Add "time ago" calculation here
          
        // Add "time ago" calculation here
      this.listOfTasks = res.map((task: any) => {
        task.timeAgo = this.getTimeAgo(task.assignedDate);

        if (task.imageName && !task.imageName.startsWith("http")) {
          task.imageName = `http://localhost:8080/api/files/images/${task.imageName}`;
        }

        console.log("upload image url :",task.imageName);
        console.log("task time ago:",task.timeAgo);
        return task;
      });

         // ✅ Sort by High Priority & Newest First
         this.listOfTasks.sort((a: any, b: any) => {
          if (this.isHighPriorityDueToday(a) && !this.isHighPriorityDueToday(b)) return -1;
          if (!this.isHighPriorityDueToday(a) && this.isHighPriorityDueToday(b)) return 1;
          return new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime(); // Newer tasks first
        });
      // // ✅ Sort tasks by assignedDate in descending order (latest first)
      //    this.listOfTasks.sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime());

      //   // Play sound if there's a high-priority task due today
        if (this.listOfTasks.some(task => this.isHighPriorityDueToday(task))) {
          this.playNotificationSound();
        }
    },
    (err) => {
      console.error("Error fetching tasks", err);
    }
  );
}
  getTimeAgo(taskDate: string): string {
    const duration = moment.duration(moment().diff(moment(taskDate)));
    return duration.humanize().replace("a day", "1 day") + " ago";
  }

  playNotificationSound() {
    let audio = new Audio();
    audio.src = "assets/mixkit-positive-notification-951.wav"; // Ensure you have a sound file
    audio.load();
    audio.play();
}
  updateStatus(id :number, status:string) {
    console.log('Updating Task ID:', id, 'with Status:', status);
  this.service.updateTask(id,status).subscribe((res)=>{
    
  console.log('Update response:', res);
  if(res.id!=null){
  this.snackbar.open("task status update successfully","close",{duration:5000});
  this.getTask();
  } else{
    this.snackbar.open("Someting went wrong..","close",{duration:5000});
  }
})
  }

  applyFilter(): void {
    const formValues = this.searchTaskForm.value;
    const title = formValues.title || null;
    const priorities = formValues.priority?.length ? formValues.priority : null;
    const taskStatuses = formValues.taskStatus?.length ? formValues.taskStatus : null;
    const categoryNames = formValues.categoryNames?.length ? formValues.categoryNames : null; 
     // <-- Added CategoryNames
    const dueDate = formValues.dueDate 
    ? new Date(formValues.dueDate).toISOString().split('T')[0] 
    : undefined;

    this.service.getFilteredTasksByUserId(title, priorities, taskStatuses, dueDate, categoryNames)
    .subscribe({
      next: (tasks) => {
        this.listOfTasks = tasks.map((task: any) => {

          task.timeAgo = this.getTimeAgo(task.assignedDate);
          if (task.imageName && !task.imageName.startsWith("http")) {
            task.imageName = `http://localhost:8080/api/files/images/${task.imageName}`;
          }
          return task;
        });
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }
 
  isHighPriorityDueToday(task: any): boolean {
    const today = new Date().setHours(0, 0, 0, 0);
    const taskDueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
    return task.priority === 'HIGH' && taskDueDate === today && task.taskStatus !='COMPLETED';
  }

  clearFilter(){
    this.searchTaskForm.reset();
    this.getTask();
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'INPROGRESS': return 'status-inprogress';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  isTaskOverdue(task: any): boolean {
    const today = new Date().setHours(0, 0, 0, 0);
    const taskDueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
    return taskDueDate < today && task.taskStatus !== 'COMPLETED';
  }
  

}


//   getTask(){
//     this.service.getTaskByUserId().subscribe(
//       (res)=>{
//       console.log(res);
//       this.listOfTasks=res;
    
//     },(err)=>{
// console.error("Error fetching tasks", err);
//     }
//   );
//   }
 // // Fetch all categories name only  from the backend it is admincomponent class code
  // getAllCategories() {
  //   this.service.getAllCategories().subscribe(
  //     (categories: string[]) => {
  //       this.allCategories = categories; // Store categories in the array
  //     },
  //     (error) => {
  //       console.error('Error fetching categories:', error);
  //     }
  //   );
  // }

    // Apply the filters based on user input
  // applyFilter():void{
  //   const formValues = this.searchTaskForm.value;
  //   const{title , taskStatus, priority,dueDate}=formValues;

  //    // You can enhance this function to filter tasks according to the form values
  //    this.service.getTaskByUserId().subscribe((data) => {
  //     // Filter tasks here if necessary
  //     this.listOfTasks = data.filter((task: { title: string | any[]; taskStatus: any; priority: any; dueDate: string | number | Date; }) =>
  //       (title ? task.title.includes(title) : true) &&
  //       (taskStatus ? task.taskStatus === taskStatus : true) &&
  //       (priority ? task.priority === priority : true) &&
  //       (dueDate ? new Date(task.dueDate).toLocaleDateString() === new Date(dueDate).toLocaleDateString() : true)
  //     );
  //   });
  // }