import { Injectable } from '@angular/core';

const TOKEN ="token";
const USER="user";
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  static saveToken(token:string):void{
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN,token);
  }

  static saveUser(user:any){
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER,JSON.stringify(user));
  }

 
  static getToken(): string|null {
    return localStorage.getItem(TOKEN);
  }

  static getUser():any{
   const userDate= localStorage.getItem(USER);
    if(userDate===null){
      return null;
    }else{
      return JSON.parse(userDate);
    }
  }

  static getUserRole(): string {
    const user=this.getUser();
    if(user==null)
      return '';
    return user.role;
  }

  static isAdminLoggedIn():boolean{
    if(this.getToken()===null)
      return false;
     const role :string= this.getUserRole();
     return role=="ADMIN";
  }

  static isEmployeeLoggedIn(): boolean{
    if(this.getToken()===null)
    return false;
    const role: string = this.getUserRole();
    return role=="EMPLOYEE";
  }

  static getUserId():string{
   const user =this.getUser();
   if(user==null)
    return "";
    return user.id;
   }

   static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
   
  }


}
