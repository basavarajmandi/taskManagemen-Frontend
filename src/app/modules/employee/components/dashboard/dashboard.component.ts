import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/auth/services/storage/storage.service';

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
      
      this.listOfTasks = res.map((task: any) => {
        if (task.imageName && !task.imageName.startsWith("http")) {
          task.imageName = `http://localhost:8080/api/files/images/${task.imageName}`;
        }
        
        console.log("upload image url :",task.imageName);
        return task;
      });
    },
    (err) => {
      console.error("Error fetching tasks", err);
    }
  );
}

  updateStatus(id :number, status:string){
    console.log('Updating Task ID:', id, 'with Status:', status);
  this.service.updateTask(id,status).subscribe((res)=>{
  console.log('Update response:', res);
  if(res.id!=null){
  this.snackbar.open("task status update successfully","close",{duration:5000});
  this.getTask();
  }
  else{
    this.snackbar.open("Someting went wrong..","close",{duration:5000});
  }
})
  }

  applyFilter(): void {
    const formValues = this.searchTaskForm.value;

    const title = formValues.title || null;
    const priorities = formValues.priority?.length ? formValues.priority : null;
    const taskStatuses = formValues.taskStatus?.length ? formValues.taskStatus : null;
    const categoryNames = formValues.categoryNames?.length ? formValues.categoryNames : null;  // <-- Added CategoryNames

    const dueDate = formValues.dueDate 
    ? new Date(formValues.dueDate).toISOString().split('T')[0] 
    : undefined;

    this.service.getFilteredTasksByUserId(title, priorities, taskStatuses, dueDate, categoryNames)
    .subscribe({
      next: (tasks) => {
        this.listOfTasks = tasks.map((task: any) => {
          if (task.imageName && !task.imageName.startsWith("http")) {
            task.imageName = `http://localhost:8080/api/files/images/${task.imageName}`;
          }
          return task;
        });
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }
 

  clearFilter(){
    this.searchTaskForm.reset();
    this.getTask();
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
  //   const formValues =this.searchTaskForm.value;
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