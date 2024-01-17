import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TeaModel } from 'src/app/core/_models/teas/TeaModel';
import { TeasService } from 'src/app/core/_services/TeasService.service';
import { FilterModalPage } from 'src/app/filter-modal/filter-modal.page';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-discover',
  templateUrl: 'discover.page.html',
  styleUrls: ['discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  teas: TeaModel[] = [];
  clickedFavoriteTea: { [key: string]: boolean } = {};
  clickedOwnedTea: { [key: string]: boolean } = {};

  filteredTeas = [...this.teas];
  searchQuery = '';

  @ViewChild('filterButton') filterButton: any;

  categories: { name: string, checked: boolean }[] = [
    { name: 'Ceai verde', checked: false },
    { name: 'Infuzie de fructe', checked: false },
    { name: 'Ceai negru', checked: false },
    { name: 'Ceai rosu - Rooibos', checked: false },
    { name: 'Infuzie de plante', checked: false },
    { name: 'Pentru cunoscatori', checked: false }
  ];

  loggedInUserEmail!: string;
  teasForUser: { favoriteTeas: any[]; ownedTeas: any[] } | null = null;
  private loginSubscription: Subscription | undefined;

  constructor(
    private modalController: ModalController,
    private teasService: TeasService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // this.loginSubscription = this.userService.onLogin().subscribe(() => {
    //   this.fetchUserData();
    // });
    this.fetchTeas();
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  private fetchTeas() {
    this.teasService.ApiTeasGetAll().subscribe(
      (teas: TeaModel[]) => {
        this.teas = teas;
        this.filterItems(); 
      },
      (error) => {
        console.error('Error fetching teas:', error);
      }
    );
  }

  filterItems() {
    if (this.categories.some(cat => cat.checked)) {
      this.filteredTeas = this.teas.filter(tea =>
        tea.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        this.categories.find(category => category.checked && category.name === tea.type)
      );
    } else {
      this.filteredTeas = this.teas.filter(tea =>
        tea.name?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  async openFilters() {
    const modal = await this.modalController.create({
      component: FilterModalPage,
      componentProps: {
        categories: [...this.categories] 
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data && data.data.categories) {
        this.categories = data.data.categories;
        this.filterItems();
      } else {
        this.categories.forEach(cat => cat.checked = false); 
        this.filterItems();
      }
      this.setFocusOnButton(); 
    });

    return await modal.present();
  }

  setFocusOnButton() {
    setTimeout(() => {
      if (this.filterButton) {
        this.filterButton.setFocus;
      }
    }, 100);
  }

  toggleFavorite(tea: TeaModel) {
    this.clickedFavoriteTea[tea.name!] = !this.clickedFavoriteTea[tea.name!];
  }

  toggleOwned(tea: TeaModel) {
    this.clickedOwnedTea[tea.name!] = !this.clickedOwnedTea[tea.name!];
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterItems();
  }

  navigateToTea(tea: TeaModel) {
    console.log('Navigating to tea:', tea);
    localStorage.setItem('selectedTeaId', tea.id!.toString());
    this.router.navigate(['/app/tea']);
  }

//   private fetchUserData() {
//     const loggedInUser = this.userService.getLoggedInUser();
//     if (loggedInUser) {
//       this.loggedInUserEmail = loggedInUser.email;
//       this.teasForUser = this.userService.getTeasForUser(this.loggedInUserEmail);
//       if (!this.teasForUser) {
//         this.teasForUser = {
//           favoriteTeas: [],
//           ownedTeas: []
//         };
//       }
//       this.updateFilteredTeas();
//     }
//   }

  // private updateFilteredTeas() {
  //   const { favoriteTeas, ownedTeas } = this.teasForUser || { favoriteTeas: [], ownedTeas: [] };
  //   const favoriteTeaNames = favoriteTeas.map(tea => tea.name);
  //   const ownedTeaNames = ownedTeas.map(tea => tea.name);
  
  //   this.filteredTeas = this.teas.filter(tea => {
  //     if (favoriteTeaNames.includes(tea.name)) {
  //       tea.favorite = true;
  //     } else {
  //       tea.favorite = false;
  //     }
  
  //     if (ownedTeaNames.includes(tea.name)) {
  //       tea.owned = true;
  //     } else {
  //       tea.owned = false;
  //     }
  
  //     return tea;
  //   });
  // }

//   toggleFavorite(tea: any) {
//     tea.favorite = !tea.favorite;
//     if (tea.favorite) {
//       tea.owned = false;
//       this.updateTeaData(tea);
//     } else {
//       this.removeTeaFromLists(tea);
//     }
//   }

//   toggleOwned(tea: any) {
//     tea.owned = !tea.owned;
//     if (tea.owned) {
//       tea.favorite = false;
//       this.updateTeaData(tea);
//     } else {
//       this.removeTeaFromLists(tea);
//     }
//   }

//   private removeTeaFromLists(tea: any) {
//     if (!this.teasForUser) {
//       return;
//     }

//     const updatedFavoriteTeas = (this.teasForUser.favoriteTeas || []).filter(
//       (t: any) => t.name !== tea.name
//     );
//     const updatedOwnedTeas = (this.teasForUser.ownedTeas || []).filter(
//       (t: any) => t.name !== tea.name
//     );

//     this.teasForUser = {
//       favoriteTeas: updatedFavoriteTeas,
//       ownedTeas: updatedOwnedTeas,
//     };

//     this.userService.setTeasForUser(this.loggedInUserEmail, this.teasForUser);
//     this.updateFilteredTeas();
//   }

//   private updateTeaData(tea: any) {
//     if (!this.teasForUser) {
//       this.teasForUser = {
//         favoriteTeas: [],
//         ownedTeas: []
//       };
//     }
  
//     const storedFavoriteTeas = this.teasForUser.favoriteTeas || [];
//     const storedOwnedTeas = this.teasForUser.ownedTeas || [];
  
//     const updatedFavoriteTeas = storedFavoriteTeas.filter((t: any) => t.name !== tea.name);
//     const updatedOwnedTeas = storedOwnedTeas.filter((t: any) => t.name !== tea.name);
  
//     if (tea.favorite && !tea.owned) {
//       updatedFavoriteTeas.push(tea);
//     } else if (tea.owned && !tea.favorite) {
//       updatedOwnedTeas.push(tea);
//     }
  
//     if (!tea.favorite && !tea.owned) {
//       // Remove the tea from both lists if neither favorite nor owned
//       const updatedFavoriteTeasFiltered = updatedFavoriteTeas.filter((t: any) => t.name !== tea.name);
//       const updatedOwnedTeasFiltered = updatedOwnedTeas.filter((t: any) => t.name !== tea.name);
//       this.teasForUser = {
//         favoriteTeas: updatedFavoriteTeasFiltered,
//         ownedTeas: updatedOwnedTeasFiltered
//       };
//     } else {
//       this.teasForUser = {
//         favoriteTeas: updatedFavoriteTeas,
//         ownedTeas: updatedOwnedTeas
//       };
//     }
  
//     this.userService.setTeasForUser(this.loggedInUserEmail, this.teasForUser);
//     this.updateFilteredTeas(); // Update filteredTeas after setting teasForUser
//   }
}