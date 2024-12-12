import { Component } from '@angular/core';
import { StorageService } from './auth/services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'task-management16';
  
  isAdminLoggedIn:boolean = StorageService.isAdminLoggedIn();
  isEmployeeLoggedIn:boolean=StorageService.isEmployeeLoggedIn();


 constructor(private router:Router){

 }
  ngOnInit()
{
this.router.events.subscribe(evnt=>{
  this.isAdminLoggedIn =StorageService.isAdminLoggedIn();
  this.isEmployeeLoggedIn=StorageService.isEmployeeLoggedIn();
})

}

logout(){
  StorageService.signOut();
  this.router.navigateByUrl("/login")
}



}
