import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.scss'],
})
export class AboutCompanyComponent {
  animationState = 'hidden'; // Animation state
 // Replace with the path to your logo
  logoUrl: string = 'assets/img/user-avatar.jpg';
 
  version: string = ' v 2.8';
  supportEmail: string = 'support@suktha.com';
  websiteUrl: string = 'https://suktha.com';
  contactNumber: string = '+91-9513997444';

 constructor(private router: Router){}

 isAdminLoggedIn : boolean =StorageService.isAdminLoggedIn();
  isEmployeloggedin: boolean=StorageService.isEmployeeLoggedIn();

  contactSupport(){}
 
  navigateHome(){
    if(this.isAdminLoggedIn){
      this.router.navigateByUrl("/admin/Maindashboard");
    }else if(this.isEmployeloggedin){
      this.router.navigateByUrl("/employee/Maindashboard");
    }
   
  }
}
