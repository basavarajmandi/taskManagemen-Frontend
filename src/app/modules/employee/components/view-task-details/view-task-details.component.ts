import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-task-details',
  templateUrl: './view-task-details.component.html',
  styleUrls: ['./view-task-details.component.scss']
})
export class ViewTaskDetailsComponent {

taskId:number =this.activeRoute.snapshot.params['id'];
commentForm!:FormGroup;
taskData:any;
comments:any;

constructor(private service: EmployeeService,private activeRoute :ActivatedRoute,private fb : FormBuilder,private snackbar:MatSnackBar){}

ngOnInit(){
 this.getCommentsTaskId();
  this.getTaskById();
  this.commentForm=this.fb.group({
    content:[null, Validators.required]
  })
}
getTaskById(){
  this.service.getTaskById(this.taskId).subscribe((res)=>{
    this.taskData=res;

  })
}
publishComment(){
  this.service.createComment(this.taskId,this.commentForm.get('content')?.value).subscribe((res)=>{
    console.log(res);
    if(res.id!=null){
      this.snackbar.open("comment published succesfully..","close",{duration:5000});
      this.getCommentsTaskId();
    }else{
      this.snackbar.open("Something went wrong","error",{duration:5000});
    }
  })

}

getCommentsTaskId(){
  this.service.getCommentsByTaskId(this.taskId).subscribe((res)=>{
    this.comments=res;
    console.log(res);

  })
}


// getCommentsTaskId() {
//   this.service.getCommentsByTaskId(this.taskId).subscribe((res) => {
//       this.comments = res.map((comment: any) => ({
//           ...comment,
//           isAdmin: comment.postedUserRole === 'ADMIN' // Adjust key based on your backend response
//       }));
//       console.log(this.comments);
//   });
// }


}
