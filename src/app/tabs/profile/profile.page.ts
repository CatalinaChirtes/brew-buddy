import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  constructor(private userService: UserService) {}

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

  logout() {
    this.userService.logout();
  }

}
