import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service'; // Adjust the path accordingly

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  loginForm = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.userService.addUser({ email: 'user@gmail.com', password: '1234' });
  }

  login() {
    const { email, password } = this.loginForm;
    const user = this.userService.getUserByEmail(email);

    if (user && user.password === password) {
      // Authentication successful, navigate to another page (e.g., dashboard)
      this.router.navigate(['/app']);

      this.loginForm = {
        email: '',
        password: '',
      };
      
    } else {
      // Invalid credentials, display error using snackbar
      this.snackBar.open('Invalid credentials', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }
}
