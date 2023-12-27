import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private router: Router) {}

  getUsers(): any[] {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
  }

  getUserByEmail(email: string): any {
    const users = this.getUsers();
    return users.find((user: any) => user.email === email);
  }

  addUser(user: any): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  setLoggedInUser(user: any): void {
    try {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      console.log('User data successfully stored.');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }
  
  getLoggedInUser(): any {
    try {
      const loggedInUserData = localStorage.getItem('loggedInUser');
      console.log('Raw logged in user data:', loggedInUserData);
  
      if (loggedInUserData) {
        const parsedData = JSON.parse(loggedInUserData);
        console.log('Parsed logged in user data:', parsedData);
        return parsedData;
      } else {
        console.warn('No logged in user data found.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  getTeasForUser(email: string): { favoriteTeas: any[]; ownedTeas: any[] } | null {
    const userTeasData = localStorage.getItem(`userTeas_${email}`);
    return userTeasData ? JSON.parse(userTeasData) : null;
  }

  setTeasForUser(email: string, teasForUser: { favoriteTeas: any[]; ownedTeas: any[] }): void {
    localStorage.setItem(`userTeas_${email}`, JSON.stringify(teasForUser));
  }
}
