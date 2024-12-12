import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  listOfTasks:any=[]
  constructor(private service:EmployeeService,private snackbar:MatSnackBar){}

  ngOnInit(){
    this.getTask();
  }

  getTask(){
    this.service.getTaskByUserId().subscribe(
      (res)=>{
      console.log(res);
      this.listOfTasks=res;
    },(err)=>{
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
  }else{
    this.snackbar.open("Someting went wrong..","close",{duration:5000});
  }
})
  }
}
