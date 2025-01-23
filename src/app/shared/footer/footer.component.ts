import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/auth/services/storage/storage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
   title = 'task-management16';
 
        @Input() disabled:boolean =false;
         @Output() saveClicked= new EventEmitter<void>();
         @Output() clerClicked =new EventEmitter<void>();

   isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn();
   isEmployeeLoggedIn: boolean = StorageService.isEmployeeLoggedIn();

constructor(private router:Router){}

  navigateHome() {
    if (this.isAdminLoggedIn) {
      this.router.navigate(['admin/Maindashboard']);
    } else if (this.isEmployeeLoggedIn) {
      this.router.navigate(['employee/Maindashboard']);
    } else {
      // Optionally, redirect to login or another page if no user is logged in
      this.router.navigate(['/login']);
    }
  }


  OnClear() {
    // Logic to clear fields
    this.clerClicked.emit();
  }

   // Method to emit the save event when button is clicked

  OnSave() {
    // Logic to save data
    this.saveClicked.emit();  // Emit the event to parent component
  }


}
