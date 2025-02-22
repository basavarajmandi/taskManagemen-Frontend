import { Component, ElementRef, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/auth/services/storage/storage.service';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-view-task-details',
  templateUrl: './view-task-details.component.html',
  styleUrls: ['./view-task-details.component.scss']
})
export class ViewTaskDetailsComponent {

  selectedVoiceFile: File | null = null;
  voicePreviewUrl: string | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  isRecording: boolean = false;
  waveSurfer!: WaveSurfer;
  isPlaying = false; // Track playback state
  recordingDuration: number = 0;  // New property to track recording duration
  recordingInterval: any;  // Variable to store the interval ID

  selectedImageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  taskId: number = this.activeRoute.snapshot.params['id'];
  commentForm!: FormGroup;
  taskData: any;
  comments: any;


  @ViewChild('waveform', { static: false }) waveformRef!: ElementRef;
  constructor(private service: EmployeeService, private activeRoute: ActivatedRoute, private fb: FormBuilder, private snackbar: MatSnackBar) { }

  ngAfterViewInit() {
    this.waveSurfer = WaveSurfer.create({
      container: this.waveformRef.nativeElement,
      waveColor: '#4CAF50',
      progressColor: '#1B5E20',
      barWidth: 3,
      cursorWidth: 0,
     // responsive: true
    });
  }


  ngOnInit() {
    this.getCommentsTaskId();
    this.getTaskById();
    this.commentForm = this.fb.group({
      content: [null, Validators.required]
    })
  }
  getTaskById() {
    this.service.getTaskById(this.taskId).subscribe((res) => {
      this.taskData = res;
      // Ensure taskData is defined and imageName exists
      if (this.taskData && this.taskData.imageName && !this.taskData.imageName.startsWith("http")) {
        this.taskData.imageName = `http://localhost:8080/api/files/images/${this.taskData.imageName}`;
      }

      if (this.taskData && this.taskData.voiceName && !this.taskData.voiceName.startsWith("http")) {
        this.taskData.voiceName = `http://localhost:8080/api/files/voice/${this.taskData.voiceName}`;
      }

    })


  }


  
  startRecording() {
    this.recordedChunks = [];
    this.isRecording = true;
    this.recordingDuration = 0; // Reset duration

    // Start the timer
    this.recordingInterval = setInterval(() => {
      this.recordingDuration++;
    }, 1000);


    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        clearInterval(this.recordingInterval); // Stop the timer

        const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        this.voicePreviewUrl = URL.createObjectURL(audioBlob);
        this.selectedVoiceFile = new File([audioBlob], 'recorded-audio.webm', { type: 'audio/webm' });

        // Load waveform after recording stops
        setTimeout(() => {
          this.waveSurfer.load(this.voicePreviewUrl!);
        }, 100);
      };
    });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      clearInterval(this.recordingInterval); // Stop the timer
  
      setTimeout(() => {
        if (this.recordedChunks.length > 0) {
          const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          this.voicePreviewUrl = URL.createObjectURL(audioBlob);
          this.selectedVoiceFile = new File([audioBlob], 'recorded-audio.webm', { type: 'audio/webm' });
  
          // Destroy existing WaveSurfer instance if it exists
          if (this.waveSurfer) {
            this.waveSurfer.destroy();
          }
  
          // Initialize a new WaveSurfer instance
          this.waveSurfer = WaveSurfer.create({
            container: this.waveformRef.nativeElement,
            waveColor: '#4CAF50',
            progressColor: '#1B5E20',
            barWidth: 3,
            cursorWidth: 1,
            height: 60, // Set height for better visibility
         //   responsive: true,
          });
  
          // Load the recorded audio into WaveSurfer
          this.waveSurfer.load(this.voicePreviewUrl);
  
          // Ensure waveform updates correctly
          this.waveSurfer.on('ready', () => {
            console.log('WaveSurfer is ready with recorded audio.');
          });
  
          this.waveSurfer.on('error', (err) => {
            console.error('WaveSurfer error:', err);
          });
  
          this.waveSurfer.on('finish', () => {
            console.log('Audio playback finished.');
            this.isPlaying = false; // Reset play button state after playback ends
          });
  
          // Auto-play after stopping the recording (Optional)
          setTimeout(() => {
         //   this.waveSurfer.play();
          }, 1000);
        }
      }, 500);
    }
  }
  
  playWaveform() {
    if (this.waveSurfer) {
      if (this.isPlaying) {
        this.waveSurfer.pause();
      } else {
        this.waveSurfer.play();
      }
      this.isPlaying = !this.isPlaying; // Toggle play state
    }
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

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];

      // Preview Image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  clearImage(): void {
    this.imagePreview = null;
    this.selectedImageFile = null;
  }

  // clearVoice(): void {
  //   this.voicePreviewUrl = null;
  //   this.selectedVoiceFile = null;
  //   this.waveSurfer.empty(); // Clear waveform
  // }

  clearRecording() {
    if (this.waveSurfer) {
      this.waveSurfer.destroy(); // Destroy waveform
      this.waveSurfer.empty(); // Clear waveform
    }
    
    // Reset all variables
    this.voicePreviewUrl = null;
    this.selectedVoiceFile = null;
    this.recordedChunks = [];
    this.isPlaying = false;
  }
  

  publishComment() {
    const formData = new FormData();

    // Append taskId and postedBy dynamically
    formData.append('taskId', this.taskId.toString()); // Use the actual task ID
    formData.append('postedBy', StorageService.getUserId().toString()); // Get logged-in user ID

    // Append content if available
    if (this.commentForm.get('content')?.value) {
      formData.append('content', this.commentForm.get('content')?.value);
    }

    // Append Image File if selected
    if (this.selectedImageFile) {
      formData.append('imageFile', this.selectedImageFile);
    }

    if (this.selectedVoiceFile) {
      formData.append('voiceFile', this.selectedVoiceFile);
    }

    // Send the request to create a comment
    this.service.createComment(formData).subscribe((res) => {
      console.log(res);
      if (res.id != null) {
        this.snackbar.open("Comment published successfully!", "Close", { duration: 5000 });
        this.getCommentsTaskId(); // Refresh comments
        this.resetForm(); // Reset form after submission
      } else {
        this.snackbar.open("Something went wrong", "Close", { duration: 5000 });
      }
    });
  }


  getCommentsTaskId() {
    this.service.getCommentsByTaskId(this.taskId).subscribe((res) => {
      this.comments = res;
      console.log(res);

    })
  }
 

  resetForm() {
    this.commentForm.reset(); // Reset the form fields
    this.selectedImageFile = null; // Clear selected image file
    this.imagePreview = null; // Remove image preview
    this.selectedVoiceFile = null;
    this.voicePreviewUrl = null;
  }

}
// startRecording() {
  //   this.recordedChunks = [];
  //   this.isRecording = true;

  //   navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  //     this.mediaRecorder = new MediaRecorder(stream);
  //     this.mediaRecorder.start();

  //     this.mediaRecorder.ondataavailable = (event) => {
  //       if (event.data.size > 0) {
  //         this.recordedChunks.push(event.data);
  //       }
  //     };

  //     this.mediaRecorder.onstop = () => {
  //       const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
  //       this.voicePreviewUrl = URL.createObjectURL(audioBlob);

  //       // Convert Blob to File
  //       this.selectedVoiceFile = new File([audioBlob], 'recorded-audio.webm', { type: 'audio/webm' });
  //     };
  //   });
  // }

  // stopRecording() {
  //   if (this.mediaRecorder) {
  //     this.mediaRecorder.stop();
  //     this.isRecording = false;
  //   }
  // }