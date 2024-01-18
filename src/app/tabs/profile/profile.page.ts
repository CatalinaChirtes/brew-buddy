import {Component} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TeaModel } from 'src/app/core/_models/teas/TeaModel';
import { UserModel } from 'src/app/core/_models/users/UserModel';
import { AuthService } from 'src/app/core/_services/AuthService.service';
import { TeasService } from 'src/app/core/_services/TeasService.service';
import { UsersService } from 'src/app/core/_services/UsersServices.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {

  favouriteTeas: TeaModel[] = [];
  ownedTeas: TeaModel[] = [];
  public user!: UserModel;

  userProfile: { picture?: SafeResourceUrl } = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private teasService: TeasService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private alertController: AlertController
  ) {}

  public logout(): void {
    this.authService.ApiLogoutGet().subscribe(response => console.log(response))
    this.authService.ApiLogoutGet();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.fetchUser();
    this.setRandomImage();
    this.fetchFavouriteTeas();
    this.fetchOwnedTeas();
  }

  private fetchUser() {
    this.route.paramMap.subscribe(params => {
      const userId = localStorage.getItem('userId');

      if (userId !== null) {
        this.usersService.ApiUserGet(userId).subscribe(
          (user: UserModel) => {
            this.user = user;
          },
          (error) => {
            console.error('Error fetching teas:', error);
          }
        );
      }
    });
  }

  private setRandomImage() {
    const imagesFolder = 'assets/images/';
    const imageNames = ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'];

    const randomImageName = imageNames[Math.floor(Math.random() * imageNames.length)];
    const imageUrl = imagesFolder + randomImageName;
    this.userProfile.picture = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }

  private fetchFavouriteTeas() {
    this.route.paramMap.subscribe(params => {
      const userId = localStorage.getItem('userId');

      if (userId !== null) {
        this.teasService.ApiTeaFavouritesGet(userId).subscribe(
          (teas: TeaModel[]) => {
            this.favouriteTeas = teas;
          },
          (error) => {
            console.error('Error fetching teas:', error);
          }
        );
      }
    });
  }

  private fetchOwnedTeas() {
    this.route.paramMap.subscribe(params => {
      const userId = localStorage.getItem('userId');

      if (userId !== null) {
        this.teasService.ApiTeaOwnedGet(userId).subscribe(
          (teas: TeaModel[]) => {
            this.ownedTeas = teas;
          },
          (error) => {
            console.error('Error fetching teas:', error);
          }
        );
      }
    });
  }

  navigateToTea(tea: TeaModel) {
    console.log('Navigating to tea:', tea);
    localStorage.setItem('selectedTeaId', tea.id!.toString());
    this.router.navigate(['/app/tea', { source: 'profile' }]);
  }

  async openEditProfileAlert() {
    const alert = await this.alertController.create({
      header: 'Edit Profile',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: this.user?.name,
          placeholder: 'Name'
        },
        {
          name: 'email',
          type: 'email',
          value: this.user?.email,
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Save',
          handler: (data) => {
            this.saveProfileChanges(data);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  saveProfileChanges(data: any) {
    const updatedUser: UserModel = {
      id: this.user?.id,
      name: data.name,
      email: data.email,
    };

    this.usersService.ApiUserPut(updatedUser).subscribe(
      (response: UserModel) => {
        console.log('Profile updated successfully:', response);
        this.fetchUser();
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }
}
