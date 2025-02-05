import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss']
})
export class UpdateTaskComponent {

  id: number = this.route.snapshot.params['id'];

  updateTaskForm !: FormGroup;
  listofEmployees: any = [];
  listOfPriorities: any = ["LOW", "HIGH", "MEDIUM","VERY-HIGH","VERY-LOW"];
  listOfTaskStatus: any = ["PENDING", "INPROGRESS", "COMPLETED", "DEFERRED", "CANCELLED"];
  
  constructor(private service: AdminService
    , private route: ActivatedRoute,
     private fb: FormBuilder,
     private snackbar:MatSnackBar,
     private router:Router) {

  }

  ngOnInit() {
    this.updateTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      taskStatus: [null, [Validators.required]]

    })
    this.getTaskById();
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

  updateTask() {
this.service.updateTask(this.id,this.updateTaskForm.value).subscribe((res)=>{
  if(res.id!=null){
    this.snackbar.open("Task update successfully","close",{duration :5000});
    this.router.navigateByUrl("admin/dashboard")
  }else{
    this.snackbar.open("Something went wrong","Error",{duration:5000})
  }
})
  }
}
