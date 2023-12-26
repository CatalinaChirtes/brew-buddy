import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service'; // Adjust the path accordingly

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage {
  signupForm = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService // Inject UserService
  ) {}

  signup() {
    const { name, email, password } = this.signupForm;

    const existingUser = this.userService.getUserByEmail(email);

    if (existingUser) {
      // User already exists, display error using snackbar
      this.snackBar.open('User already exists', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    } else {
      // Add the new user using UserService
      this.userService.addUser({ name, email, password });

      // Show success message and navigate to the login page after successful signup
      this.snackBar.open('Signup successful', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      this.signupForm = {
        name: '',
        email: '',
        password: '',
      };

      this.router.navigate(['/login']); // Navigate only if user doesn't exist
    }
  }
}
