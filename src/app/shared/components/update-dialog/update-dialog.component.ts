import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { AddLinkDialogComponent } from '../add-link-dialog/add-link-dialog.component';
@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent {
  id: number = this.route.snapshot.params['id'];
  updateTaskForm !: FormGroup;
  links: { url: string }[] = []; // Ensures links are objects with a 'url' property
  listofEmployees: any = [];
  listOfPriorities: any = ["LOW", "HIGH", "MEDIUM", "VERY-HIGH", "VERY-LOW"];
  listOfTaskStatus: any = ["PENDING", "INPROGRESS", "COMPLETED", "DEFERRED", "CANCELLED"];
  listOfCategories: any = [];
  selectedCategoryName: string = ''; // Store selected category name
  taskData: any;
  // Existing variables
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  existingImageUrl: string | null = null;

  // Voice Recording Properties
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  voicePreview: string | null = null;
  existingVoiceUrl: string | null = null;
  selectedVoice: File | null = null; // Declare for voice file

  constructor(
    private dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private service: AdminService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.updateTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      taskStatus: [null, [Validators.required]],
      image: [null],
      voice: [null],
      categoryId: [null],
      categoryName: [''],

    })
    this.service.getTaskById(this.data.id).subscribe((res) => {
      console.log("Task Data:", res); // Debugging line
      console.log("Image Name:", res.imageName); // Debugging line
      this.updateTaskForm.patchValue(res);
      this.getCategories();

      this.selectedCategoryName = res.categoryName;
      // Set initial category name
      this.getusers();


      if (res.links) {
        this.links = res.links.map((link: any) => typeof link === 'string' ? { url: link } : link);
      } else {
        this.links = [];
      }
      console.log("Formatted Links:", this.links); // Debugging
      // Ensure imagePreview is set correctly
      if (res.imageName) {
        this.existingImageUrl = res.imageName; // Already set in getTaskById
        this.imagePreview = this.existingImageUrl;
      } else {
        this.imagePreview = null;
      }
         // Set voice preview
         if (res.voiceName) {
          this.existingVoiceUrl = res.voiceName;
          this.voicePreview = this.existingVoiceUrl;
        }

    });
  }
 

  getTaskById() {
    this.service.getTaskById(this.id).subscribe((res) => {
      console.log("API Response:", res); // Check if imageName exists
      console.log(res);
      this.getusers();
      this.getCategories();
      this.updateTaskForm.patchValue(res);
    })
  }

  getusers() {
    this.service.getUsers().subscribe((res) => {
      this.listofEmployees = res;
      console.log(res);
    })
  }

  getCategories() {
    this.service.getCategories().subscribe((res) => {
      this.listOfCategories = res;
    });
  }

  openAddLinkDialog(): void {
    const dialogRef = this.dialog.open(AddLinkDialogComponent, {
      width: '400px',
      data: { links: this.links.map(link => link.url) } // Pass only URLs as strings
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.links = result.map((link: string) => ({ url: link })); // Convert back to objects
      }
    });
  }
  
  
  

  // Remove Link from List
  removeLink(index: number): void {
    this.links.splice(index, 1);
  }


  openCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { categories: this.listOfCategories }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.categoryId) {
          this.updateTaskForm.patchValue({ categoryId: result.categoryId, categoryName: '' });
          this.selectedCategoryName = result.categoryName;
        } else if (result.categoryName) {
          this.updateTaskForm.patchValue({ categoryId: null, categoryName: result.categoryName });
          this.selectedCategoryName = result.categoryName;
        }
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Store the selected file
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Show new image preview
        console.log("existing image:" + this.imagePreview);
      };
      reader.readAsDataURL(file);
    }
  }

  startRecording() {
    // Remove existing voice preview before starting a new recording
    this.voicePreview = null; 
    this.existingVoiceUrl = null;  
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.isRecording = true;
      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
  
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.voicePreview = URL.createObjectURL(audioBlob);
        this.selectedVoice = new File([audioBlob], "recorded-audio.wav", { type: 'audio/wav' }); // Save file
      };
  
      this.mediaRecorder.start();
    }).catch(error => {
      console.error("Error accessing microphone: ", error);
    });
  }
  
  stopRecording() {
    if (this.mediaRecorder) {
      this.isRecording = false;
      this.mediaRecorder.stop();
    }
  }

  updateTask() {
    if (this.updateTaskForm.invalid) {
      this.snackbar.open('Please fill out all required fields', 'Close', { duration: 5000 });
      return;
    }
    const formValue = this.updateTaskForm.value;
    let formattedDueDate = null;
    if (formValue.dueDate) {
      const dueDate = new Date(formValue.dueDate);
      formattedDueDate = dueDate.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }

    const taskUpdateData = {
      
      ...formValue,
      
      dueDate: formattedDueDate, // Ensure dueDate is correctly formatted
      categoryId: formValue.categoryId || null,
      categoryName: formValue.categoryName || null,
      links: this.links.map(link => ({ url: link.url })) // Send as array of objects
      
    };

    this.service.updateTask(this.data.id, taskUpdateData, this.selectedFile || undefined,this.selectedVoice || undefined).subscribe({
      next: () => {
        this.snackbar.open('Task updated successfully', 'Close', { duration: 5000 });
        this.dialogRef.close(true); // Close dialog and indicate success
      },
      error: () => {
        this.snackbar.open('Failed to update task', 'Close', { duration: 5000 });
      },
    });
  }
}

