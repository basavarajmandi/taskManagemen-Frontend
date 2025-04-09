import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


// const BASE_URL="http://localhost:8080/";
const BASE_URL="http://task-management-app-env.eba-xp9q7my3.eu-north-1.elasticbeanstalk.com/";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }
  

  signUp(signupRequest:any):Observable<any>{
    return this.httpClient.post(BASE_URL+ "api/auth/signup",signupRequest);

  }

  login(loginRequest:any):Observable<any>{
    return this.httpClient.post(BASE_URL+"api/auth/login",loginRequest);
  }

}
