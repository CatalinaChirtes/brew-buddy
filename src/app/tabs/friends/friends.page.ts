import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/core/_models/users/UserModel';
import { UsersService } from 'src/app/core/_services/UsersServices.service';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss'],
})
export class FriendsPage {

  public users: UserModel[] = [];

  constructor(
    private usersService: UsersService
  ) {}

  async ngOnInit() {
    this.usersService.ApiUsersGetAll().subscribe( response => console.log(response))
  }
}
