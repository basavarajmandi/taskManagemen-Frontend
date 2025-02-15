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
  // Ensure taskData is defined and imageName exists
  if (this.taskData && this.taskData.imageName && !this.taskData.imageName.startsWith("http")) {
    this.taskData.imageName = `http://localhost:8080/api/files/images/${this.taskData.imageName}`;
  }
  
  if(this.taskData && this.taskData.voiceName && !this.taskData.voiceName.startsWith("http")){
    this.taskData.voiceName =`http://localhost:8080/api/files/voice/${this.taskData.voiceName}`;
  }

  })

  
}
downloadImage(imageUrl: string) {
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
      link.download = this.extractFileName(imageUrl); // Extract filename
      document.body.appendChild(link);
      link.click(); // Trigger download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // Cleanup memory
    })
    .catch(error => console.error('Image download failed:', error));
}

// Extracts the file name from the image URL
extractFileName(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1) || 'downloaded-image.jpg';
}
shareImage(imageUrl: string) {
  const text = encodeURIComponent("Check out this image!");
  const url = encodeURIComponent(imageUrl);

  // WhatsApp Share Link
  const whatsappUrl = `https://wa.me/?text=${text} ${url}`;

  // Open in new tab
  window.open(whatsappUrl, "_blank");
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
