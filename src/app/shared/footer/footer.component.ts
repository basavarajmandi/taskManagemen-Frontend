import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/auth/services/storage/storage.service';
import { AdminService } from 'src/app/modules/admin/services/admin.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  title = 'task-management16';

  @Input() showSave: boolean = true; // Control visibility of Save button
  @Input() showClear: boolean = true; // Control visibility of Clear button
  @Input() disabled: boolean = false;
  @Input() showExport :boolean=false;//new input for export button


  @Output() saveClicked = new EventEmitter<void>();
  @Output() clerClicked = new EventEmitter<void>();
  @Output() exportClicked=new EventEmitter<void>();

  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn();
  isEmployeeLoggedIn: boolean = StorageService.isEmployeeLoggedIn();

  constructor(private router: Router,private adminService:AdminService) { }



  onExport() {
    console.log('Export button clicked'); // Debugging

    this.adminService.exportToExcel().subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log('Export successful');
      },
      (error) => {
        console.error('Error exporting to Excel:', error);
      }
    );
  }







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
