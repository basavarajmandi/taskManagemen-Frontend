import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {


  signupForm!:FormGroup;
  hidePassword: boolean = true;

  constructor(private fb:FormBuilder,private snackbar: MatSnackBar,private authService :AuthService,private router:Router){  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      password: [null, [Validators.required]],//,Validators.minLength(8)
      ConfirmPassword: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
    })
  }

 
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword; 
  }


  signup() {

    const password = this.signupForm.get("password")?.value;
    const ConfirmPassword = this.signupForm.get("ConfirmPassword")?.value;

    if (password !== ConfirmPassword) {
      this.snackbar.open("password do not match!.", "close", { duration: 5000, panelClass: 'error-snackbar' });
      return;
    }

    console.log(this.signupForm.value);
    this.authService.signUp(this.signupForm.value).subscribe((res) => {
      console.log(res);
      if (res.id != null) {
        this.snackbar.open("Signup successfull", "close", { duration: 5000, panelClass: 'error-snackbar' });
        this.router.navigateByUrl("/login")
      }else{
        this.snackbar.open("SignUp faild.try again","close",{duration:5000,panelClass:'error-snackbar'});
      }
    });




  }


}
