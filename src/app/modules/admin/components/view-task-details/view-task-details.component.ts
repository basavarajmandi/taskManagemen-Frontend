import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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

constructor(private service: AdminService,private activeRoute :ActivatedRoute,private fb : FormBuilder,private snackbar:MatSnackBar){}

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

       //  addming this in today Ensure the image URL is formatted correctly if it's not already a full URL
       if (this.taskData && this.taskData.imageName && !this.taskData.imageName.startsWith("http")) {
        this.taskData.imageName = `http://localhost:8080/api/files/images/${this.taskData.imageName}`;
      }

      if(this.taskData && this.taskData.voiceName && !this.taskData.voiceName.startsWith("http")){
        this.taskData.voiceName =`http://localhost:8080/api/files/voice/${this.taskData.voiceName}`;
      }

  });
}
publishComment(){
  this.service.createComment(this.taskId,this.commentForm.get('content')?.value).subscribe((res)=>{
    console.log(res);
    if(res.id!=null){
      this.snackbar.open("comment published succesfully","close",{duration:5000});
      this.getCommentsTaskId();
    }else{
      this.snackbar.open('Something went wrong','error',{duration:5000});
    }
  })

}

getCommentsTaskId(){
  this.service.getCommentsByTaskId(this.taskId).subscribe((res)=>{
    this.comments=res;

  })
}



}
