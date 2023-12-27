import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

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
    private userService: UserService
  ) {}

  signup() {
    const { name, email, password } = this.signupForm;

    const existingUser = this.userService.getUserByEmail(email);

    if (existingUser) {
      this.snackBar.open('User already exists', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));

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

      this.router.navigate(['/login']);
    }
  }
}
