import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: any[] = [];
  private loggedInUser: any = null;

  constructor(private router: Router) {}

  getUsers(): any[] {
    return this.users;
  }

  getUserByEmail(email: string): any {
    return this.users.find((user) => user.email === email);
  }

  addUser(user: any): void {
    this.users.push(user);
  }

  // Function to set the logged-in user
  setLoggedInUser(user: any): void {
    this.loggedInUser = user;
  }

  // Function to get the logged-in user
  getLoggedInUser(): any {
    return this.loggedInUser;
  }

  // Function to log out the user
  logout(): void {
    // Clear the logged-in user when logging out
    this.loggedInUser = null;
    this.router.navigate(['/login']);
  }
}
