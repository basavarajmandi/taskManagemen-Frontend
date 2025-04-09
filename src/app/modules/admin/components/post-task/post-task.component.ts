import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CategoryDialogComponent } from 'src/app/shared/components/category-dialog/category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddLinkDialogComponent } from 'src/app/shared/components/add-link-dialog/add-link-dialog.component';

@Component({
  selector: 'app-post-task',
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.scss'],
  animations: [
    trigger('slideInFromRight', [
      state('hidden', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('hidden => visible', [
        animate('0.5s ease-in-out')])
    ])
  ],
})
export class PostTaskComponent {

  links: string[] = [];
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
  listOfUsers: any[] = []; // Added for keep-in-loop users

  constructor(private adminService: AdminService,
    private fb: FormBuilder, private router: Router, private snackbar: MatSnackBar,private dialog: MatDialog) {
  }

  ngOnInit() {
    this.postTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      priority: ['HIGH', [Validators.required]],
      image: [null],
      categoryId: [null], // Can be null initially
      categoryName: [''],
      location: [''] , // <-- New Field for Location
      keepInLoopUsers: [[]] // Added field for selected users
    })
    this.getUsers();
    this.loadCategories();
    this.getKeepInLoopUsers();

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
  getKeepInLoopUsers() {
    this.adminService.getUsers().subscribe((res) => {
      this.listOfUsers = res; // Fetching users to show in dropdown
    });
  }

  loadCategories() {
    this.adminService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(categories);
    });
  }
 
  postTask() {
    if (this.postTaskForm.invalid) return;

    const taskData = { ...this.postTaskForm.value,links:this.links };


     // Ensure priority is set to HIGH if user didn't select one
  if (!taskData.priority) {
    taskData.priority = 'HIGH';
  }

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

  openAddLinkDialog(): void {
    const dialogRef = this.dialog.open(AddLinkDialogComponent, {
      width: '400px',
      data: { links: [...this.links] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.links = result; // Update the links
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
  openMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          // Fetch Address using Reverse Geocoding API
          this.getAddressFromCoordinates(latitude, longitude);
  
          // Set Coordinates in the Form
          this.postTaskForm.patchValue({
            location: `${latitude},${longitude}`
          });
  
          // Open Google Maps
          window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  getAddressFromCoordinates(lat: number, lng: number) {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK' && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          
          // Save the address in the form
          this.postTaskForm.patchValue({
            address: address
          });
  
          console.log("Address:", address);
        } else {
          console.error("No address found");
        }
      })
      .catch(error => console.error("Error fetching address:", error));
  }
  

  // openMap() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
          
  //         // Set location in form
  //         this.postTaskForm.patchValue({
  //           location: `${latitude},${longitude}`
  //         });
  
  //         // Open Google Maps
  //         window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //         alert("Unable to fetch location. Please enable location services.");
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // }
  
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