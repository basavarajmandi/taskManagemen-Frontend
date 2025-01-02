import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-task',
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.scss']
})
export class PostTaskComponent {
  postTaskForm !:FormGroup;
  listofEmployees  :any = [];
  listOfPriorities: any=["LOW","HIGH","MEDIUM"];

constructor(private adminService:AdminService,
  private fb:FormBuilder,private router:Router,private snackbar:MatSnackBar
){
}

ngOnInit() {
  this.postTaskForm = this.fb.group({
    employeeId: [null, [Validators.required]],
    title: [null, [Validators.required]],
    dueDate: [null, [Validators.required]],
    description: [null, [Validators.required]],
    priority: [null, [Validators.required]],

  })
  this.getUsers();
}


getUsers(){
  this.adminService.getUsers().subscribe((res=>{
    this.listofEmployees=res;
    console.log(res);
  }))
}

postTask(){
  
this.adminService.postTask(this.postTaskForm.value).subscribe((res)=>{
console.log(res);
if(res.id!=null){
  this.router.navigateByUrl("admin/dashboard");
  this.snackbar.open('Task Posted SuccessFully..','close',{duration:5000});
}else{
  this.snackbar.open('Somthing went roung ..','close',{duration:5000});
}
})
}

}
