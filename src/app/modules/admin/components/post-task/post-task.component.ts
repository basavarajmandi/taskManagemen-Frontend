import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CategoryDialogComponent } from 'src/app/shared/components/category-dialog/category-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-post-task',
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.scss'],
  animations: [
    trigger('slideInFromRight', [
      state('hidden', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('hidden => visible', [
        animate('0.5s ease-in-out')
      ])
    ])
  ],

})
export class PostTaskComponent {

  audioUrl: string | null = null;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  voiceFile: File | null = null;
  postTaskForm !: FormGroup;
 
  listOfPriorities: any = ["LOW", "HIGH", "MEDIUM", "VERY-HIGH", "VERY_LOW"];
  animationState = 'hidden'; // Animation state
  listofEmployees: any = [];
  categories: any[] = [];
  selectedCategoryName = '';
  selectedCategoryId: number | null = null;
  newCategoryName: string = '';

  constructor(private adminService: AdminService,
    private fb: FormBuilder, private router: Router, private snackbar: MatSnackBar,private dialog: MatDialog) {
  }

  ngOnInit() {
    this.postTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      image: [null],
      categoryId: [null], // Can be null initially
      categoryName: ['']
    })
    this.getUsers();
    this.loadCategories();

    // Trigger the animation after the component initializes
    setTimeout(() => {
      this.animationState = 'visible';
    }, 0);
  }

  getUsers() {
    this.adminService.getUsers().subscribe((res => {
      this.listofEmployees = res;
      console.log(res);
    }))
  }

  loadCategories() {
    this.adminService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(categories);
    });
  }
 

  postTask() {
    if (this.postTaskForm.invalid) return;
  
    const taskData = { ...this.postTaskForm.value };
  
    if (taskData.dueDate) {
      const dueDate = new Date(taskData.dueDate); // Convert form input to Date object

    // Extract only the local date (YYYY-MM-DD) to avoid timezone issues
    const year = dueDate.getFullYear();
    const month = String(dueDate.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit format
    const day = String(dueDate.getDate()).padStart(2, '0'); // Ensure 2-digit format

    taskData.dueDate = `${year}-${month}-${day}`; // Store as YYYY-MM-DD (No Timezone shift)
  }
  
    this.adminService.postTask(taskData, this.imageFile ?? undefined, this.voiceFile ?? undefined).subscribe(res => {
      if (res.id != null) {
        this.router.navigateByUrl("admin/dashboard");
        this.snackbar.open('Task Posted Successfully', 'Close', { duration: 5000 });
      } else {
        this.snackbar.open('Something went wrong', 'Close', { duration: 5000 });
      }
    });
  }


  openCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { categories: this.categories }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.categoryId) {
          this.selectedCategoryId = result.categoryId;
          this.selectedCategoryName = this.categories.find(c => c.id === result.categoryId)?.name || '';
          this.postTaskForm.patchValue({ categoryId: result.categoryId });
        } else if (result.categoryName) {
          this.selectedCategoryName = result.categoryName;
          this.postTaskForm.patchValue({ categoryName: result.categoryName });
        }
      }
    });
  }


  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  

  clearFields() {
    this.postTaskForm.reset();
    this.imagePreview = null;
    this.imageFile = null;
  }
  deleteImage(){
    this.imagePreview=null;
    this.imageFile=null;
  }


  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedChunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.voiceFile = new File([audioBlob], `voice-${Date.now()}.wav`, { type: 'audio/wav' });

      };
    });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
  deleteVoice() {
    this.audioUrl = null;
    this.voiceFile = null;
  }



}
// postTask() {
//   this.adminService.postTask(this.postTaskForm.value).subscribe((res) => {
//     console.log(res);
//     if (res.id != null) {
//       this.router.navigateByUrl("admin/dashboard");
//       this.snackbar.open('Task Posted SuccessFully..', 'close', { duration: 5000 });
//     } else {
//       this.snackbar.open('Somthing went roung ..', 'close', { duration: 5000 });
//     }
//   })
// }