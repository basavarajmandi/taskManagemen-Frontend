import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


// const BASE_URL="http://localhost:8080/";
//  const BASE_URL="http://localhost:5000/";

// const BASE_URL="http://task-management-app-env-1.eba-zbqsymrq.eu-north-1.elasticbeanstalk.com/";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = environment.BASE_URL;  // Use the BASE_URL from the environment file

  constructor(private httpClient: HttpClient) { }
  

  signUp(signupRequest:any):Observable<any>{
    return this.httpClient.post(this.BASE_URL+ "api/auth/signup",signupRequest);

  }

  login(loginRequest:any):Observable<any>{
    return this.httpClient.post(this.BASE_URL+"api/auth/login",loginRequest);
  }


}
