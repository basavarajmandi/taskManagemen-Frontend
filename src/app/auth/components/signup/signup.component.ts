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
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required,Validators.minLength(8)]],//,
      confirmPassword: ['', Validators.required]  // ✅ Make sure it's included here
      
    })
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword; 
  }

  signup() {

    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
    }
    const password = this.signupForm.get("password")?.value;
    const confirmPassword = this.signupForm.get("confirmPassword")?.value;

    if (password !== confirmPassword) {
      this.snackbar.open("Passwords do not match!", "Close", { duration: 5000, panelClass: 'error-snackbar' });
      return;
    }
 
    this.authService.signUp(this.signupForm.value).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackbar.open("Signup successful!", "Close", { duration: 5000, panelClass: 'success-snackbar' });
          this.router.navigateByUrl("/login");
        }
      },
      error: (err) => {
        console.log("Signup Error:", err);

      if (err.status === 406 && err.error) {
        this.snackbar.open(err.error, "Close", { duration: 5000, panelClass: 'error-snackbar' });

        } else {
          this.snackbar.open("Signup failed. Please try again.", "Close", { duration: 5000, panelClass: 'error-snackbar' });
        }
      }
    });
  }
}
