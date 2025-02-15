import { Component } from '@angular/core';
import { StorageService } from './auth/services/storage/storage.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'task-management16';

  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn();
  isEmployeeLoggedIn: boolean = StorageService.isEmployeeLoggedIn();
  employeeName: string = ''; // variable to hold logged-in employee
  showFooter: boolean = true;
  showExport:boolean=false;
  showFooterButtons: boolean = true; // New flag to control Save & Clear buttons


  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.root;
          while (route.firstChild) {
            route = route.firstChild; // Get the deepest child route
          }
          return {
            hideFooter: route.snapshot.data['hideFooter'] || false,
            hideFooterButtons: route.snapshot.data['hideFooterButtons'] || false,
            showExport: route.snapshot.data['showExport'] || false, // Add this line
          };
        })
      )
      .subscribe(({ hideFooter, hideFooterButtons,showExport }) => {
        this.showFooter = !hideFooter;
        this.showFooterButtons = !hideFooterButtons;
        this.showExport = showExport; // Update the export button visibilit
      });
  }


  ngOnInit() {
    this.router.events.subscribe(evnt => {
      this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
      this.isEmployeeLoggedIn = StorageService.isEmployeeLoggedIn();
      if(this.isEmployeeLoggedIn){
        this.employeeName= StorageService.getuserName();
      }
    })
  }

  logout() {
    StorageService.signOut();
    this.router.navigateByUrl("/login");
  }
  openDialog() { }
  // settings() { 
  //   this.router.navigateByUrl("/virw-table");
  // }
  openSetting2(){}
  profile() { }
  
  about() { 
   this.router.navigateByUrl("/about");
  }

 changePassword(){}
 privacySettings(){}

 ViewSettings(){
   this.router.navigateByUrl("/Admin-view-table");
 }
}

















  // constructor(private router: Router) {}
//  // Check if the current route matches 'mainDashboard'
//  shouldShowFooter(): boolean {

//   const hiddenRouter =['/admin/Maindashboard', '/login','/signup'];
//   return !hiddenRouter.includes(this.router.url);
// }

//-------------------------------------------------------------------------------------
// showFooter = true;
// constructor(private router: Router) {
//   this.router.events.subscribe((event) => {
//     if (event instanceof NavigationEnd) {
//       const currentRoute = this.router.routerState.snapshot.root.firstChild;
//       this.showFooter = !(currentRoute?.data['hideFooter']);
//     }
//   });
// }