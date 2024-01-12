import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../core/_services/AuthService.service';
import { UserLoginModel } from '../core/_models/auth/UserLoginModel';
import { UserModel } from '../core/_models/users/UserModel';
import { UsersService } from '../core/_services/UsersServices.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginUser: UserLoginModel = {
    email: '',
    password: '',
  };

  // public user!: UserModel;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private usersService: UsersService

  ) {}

  ngOnInit(): void {}

  public login(): void {
    // this.authService.ApiLoginPost(this.loginUser).subscribe(response => console.log(response))
    // this.authService.ApiLoginPost(this.loginUser);
    // this.router.navigate(['/app']);

    this.authService.ApiLoginPost(this.loginUser).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/app']);

        this.snackBar.open("Signed in successfully.", 'Close', {
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
