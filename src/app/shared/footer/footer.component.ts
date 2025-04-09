import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/auth/services/storage/storage.service';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { EmployeeService } from 'src/app/modules/employee/services/employee.service';

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
  @Input() userId: number | null = null; // Input for Employee ID

  @Output() saveClicked = new EventEmitter<void>();
  @Output() clerClicked = new EventEmitter<void>();
  @Output() exportClicked=new EventEmitter<void>();
  
  isAdminLoggedIn: boolean = false;
  isEmployeeLoggedIn: boolean = false;

  // isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn();
  // isEmployeeLoggedIn: boolean = StorageService.isEmployeeLoggedIn();

  constructor(
    private router: Router,
    private adminService:AdminService,
    private employeeService:EmployeeService) { }

    ngOnInit(): void {
      this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
      this.isEmployeeLoggedIn = StorageService.isEmployeeLoggedIn();
  
      // Ensure userId is assigned if the user is an Employee
      if (this.isEmployeeLoggedIn && !this.userId) {
        const storedUserId = StorageService.getUserId();
        this.userId = storedUserId ? Number(storedUserId) : null;
      }
  
      console.log("isAdminLoggedIn:", this.isAdminLoggedIn);
      console.log("isEmployeeLoggedIn:", this.isEmployeeLoggedIn);
      console.log("userId:", this.userId);
    }
  onExport() {
    console.log('Export button clicked');

    console.log("isAdminLoggedIn:", this.isAdminLoggedIn);
    console.log("isEmployeeLoggedIn:", this.isEmployeeLoggedIn);
    console.log("userId:", this.userId);

    

    if (this.isAdminLoggedIn) {
      this.adminService.exportToExcel().subscribe(
        (blob) => this.downloadFile(blob, 'admin_tasks.xlsx'),
        (error) => console.error('Error exporting Admin data:', error)
      );
    } 
    else if (this.isEmployeeLoggedIn && this.userId !== null) {
      this.employeeService.exportToExcelByUserId(this.userId).subscribe(
        (blob) => this.downloadFile(blob, `employee_tasks_${this.userId}.xlsx`),
        (error) => console.error('Error exporting Employee data:', error)
      );
    } 
    else {
      console.error('Export failed: User not identified.');
    }
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('Export successful:', filename);
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

 // onExport() {
  //   console.log('Export button clicked'); // Debugging

  //   this.adminService.exportToExcel().subscribe(
  //     (blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'tasks.xlsx';
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       console.log('Export successful');
  //     },
  //     (error) => {
  //       console.error('Error exporting to Excel:', error);
  //     }
  //   );
  // }
