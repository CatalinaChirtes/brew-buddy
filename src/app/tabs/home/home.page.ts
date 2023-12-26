import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(private userService: UserService) {}

  logout() {
    // Call the logout function from your authentication service
    this.userService.logout();
  }

}
