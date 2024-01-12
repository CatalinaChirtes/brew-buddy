import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/_services/AuthService.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  userProfile: { name: string, email: string, picture?: string } = {
    name: '', 
    email: '', 
  };

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.handleFile(file);
  }

  handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.userProfile.picture = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  public logout(): void {
    this.authService.ApiLogoutGet().subscribe(response => console.log(response))
    this.authService.ApiLogoutGet();
    this.router.navigate(['/login']);
  }
}
