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
audioUrl: string = ''; // Path of voice message from backend
transcript: string = ''; // Stores converted text

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

// getCommentsTaskId(){
//   this.service.getCommentsByTaskId(this.taskId).subscribe((res)=>{
//     this.comments=res;

//   })
// }
getCommentsTaskId() {
  this.service.getCommentsByTaskId(this.taskId).subscribe((res) => {
    this.comments = res.map((comment: any) => {
      if (comment.imageName && !comment.imageName.startsWith("http")) {
        comment.imageName = `http://localhost:8080/api/files/comment/images/${comment.imageName}`;
      }
      if (comment.voiceName && !comment.voiceName.startsWith("http")) {
        comment.voiceName = `http://localhost:8080/api/files/comment/voice/${comment.voiceName}`;
      }
      return comment;
    });
  });
}
downloadImage(imageUrl: string): void {
  fetch(imageUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob(); // Convert response to blob
    })
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob); // Create a blob URL
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = this.extractFileName(imageUrl); // Extract the file name
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // Cleanup memory
    })
    .catch(error => console.error('Image download failed:', error));
}

// Function to extract file name from URL
extractFileName(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1);
}



}
