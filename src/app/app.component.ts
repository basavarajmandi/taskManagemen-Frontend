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
  showFooter: boolean = false;

constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild; // Get the deepest child route
        }
        return route?.snapshot.data['hideFooter'] || false;
      })
    )
    .subscribe((hideFooter) => {
      this.showFooter = !hideFooter;
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