import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInputModel } from '../core/_models/auth/UserInputModel';
import { UsersService } from '../core/_services/UsersServices.service';
import { AuthService } from '../core/_services/AuthService.service';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupUser: UserInputModel = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {}

  public signup(): void {
    this.authService.ApiSignupPost(this.signupUser).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/login']);

        this.snackBar.open("Signed up successfully.", 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        return response;
      },
      (error) => {
        console.error(error);
        let errorMessage = 'An error occurred';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    );
  }
}
