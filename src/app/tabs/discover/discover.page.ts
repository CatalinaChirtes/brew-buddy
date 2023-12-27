import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterModalPage } from 'src/app/filter-modal/filter-modal.page';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-discover',
  templateUrl: 'discover.page.html',
  styleUrls: ['discover.page.scss']
})
export class DiscoverPage {
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

  constructor(
    private modalController: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.fetchUserData();
  }

  teas = [
    { name: 'Flavored Raspberry Tart', category: 'Ceai verde', imageURL: 'https://cdn.dc5.ro/img-prod/1659730-0.jpeg', favorite: false, owned: false },
    { name: 'Raspberry & Flowers', category: 'Infuzie de fructe', imageURL: 'https://cdn.dc5.ro/img-prod/1976979-0.jpeg', favorite: false, owned: false },
    { name: 'Chocolate Cream Truffles', category: 'Ceai negru', imageURL: 'https://cdn.dc5.ro/img-prod/439661-0.jpg', favorite: false, owned: false },
    { name: 'Strawberry Banana', category: 'Ceai rosu - Rooibos', imageURL: 'https://cdn.dc5.ro/img-prod/2000000140544-1715608.jpg', favorite: false, owned: false },
    { name: 'Classic Spicy Cocktail', category: 'Infuzie de fructe', imageURL: 'https://cdn.dc5.ro/img-prod/97420-0.jpeg', favorite: false, owned: false },
  ];

  filteredTeas = [...this.teas];
  searchQuery = '';

  filterItems() {
    if (this.categories.some(cat => cat.checked)) {
      this.filteredTeas = this.teas.filter(tea =>
        tea.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        this.categories.find(category => category.checked && category.name === tea.category)
      );
    } else {
      // If no categories are selected, display all items
      this.filteredTeas = this.teas.filter(tea =>
        tea.name.toLowerCase().includes(this.searchQuery.toLowerCase())
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
        // Update categories based on modal result
        this.categories = data.data.categories;
        this.filterItems(); // Reapply filters after category changes
      } else {
        // If no categories are returned (i.e., modal dismissed without changes), show all items
        this.categories.forEach(cat => cat.checked = false); // Uncheck all categories
        this.filterItems(); // Show all items
      }
      this.setFocusOnButton(); // Set focus back to the filter button
    });

    return await modal.present();
  }

  setFocusOnButton() {
    setTimeout(() => {
      if (this.filterButton) {
        this.filterButton.setFocus();
      }
    }, 100);
  }

  private fetchUserData() {
    const loggedInUser = this.userService.getLoggedInUser();
    if (loggedInUser) {
      this.loggedInUserEmail = loggedInUser.email;
      this.teasForUser = this.userService.getTeasForUser(this.loggedInUserEmail);
      if (!this.teasForUser) {
        this.teasForUser = {
          favoriteTeas: [],
          ownedTeas: []
        };
      }
  
      // Update filteredTeas based on the user's preferences
      this.updateFilteredTeas();
    }
  }

  private updateFilteredTeas() {
    const { favoriteTeas, ownedTeas } = this.teasForUser || { favoriteTeas: [], ownedTeas: [] };
    const favoriteTeaNames = favoriteTeas.map(tea => tea.name);
    const ownedTeaNames = ownedTeas.map(tea => tea.name);
  
    // Filter teas based on user preferences
    this.filteredTeas = this.teas.filter(tea => {
      if (favoriteTeaNames.includes(tea.name)) {
        tea.favorite = true;
      } else {
        tea.favorite = false;
      }
  
      if (ownedTeaNames.includes(tea.name)) {
        tea.owned = true;
      } else {
        tea.owned = false;
      }
  
      return tea;
    });
  }

  toggleFavorite(tea: any) {
    tea.favorite = !tea.favorite;
    if (tea.favorite) {
      tea.owned = false;
      this.updateTeaData(tea);
    }
  }

  toggleOwned(tea: any) {
    tea.owned = !tea.owned;
    if (tea.owned) {
      tea.favorite = false;
      this.updateTeaData(tea);
    }
  }

  private updateTeaData(tea: any) {
    if (!this.teasForUser) {
      this.teasForUser = {
        favoriteTeas: [],
        ownedTeas: []
      };
    }
  
    const storedFavoriteTeas = this.teasForUser.favoriteTeas || [];
    const storedOwnedTeas = this.teasForUser.ownedTeas || [];
  
    const updatedFavoriteTeas = storedFavoriteTeas.filter((t: any) => t.name !== tea.name);
    const updatedOwnedTeas = storedOwnedTeas.filter((t: any) => t.name !== tea.name);
  
    if (tea.favorite && !tea.owned) {
      updatedFavoriteTeas.push(tea);
    } else if (tea.owned && !tea.favorite) {
      updatedOwnedTeas.push(tea);
    }
  
    if (!tea.favorite && !tea.owned) {
      // Remove the tea from both lists if neither favorite nor owned
      const updatedFavoriteTeasFiltered = updatedFavoriteTeas.filter((t: any) => t.name !== tea.name);
      const updatedOwnedTeasFiltered = updatedOwnedTeas.filter((t: any) => t.name !== tea.name);
      this.teasForUser = {
        favoriteTeas: updatedFavoriteTeasFiltered,
        ownedTeas: updatedOwnedTeasFiltered
      };
    } else {
      this.teasForUser = {
        favoriteTeas: updatedFavoriteTeas,
        ownedTeas: updatedOwnedTeas
      };
    }
  
    this.userService.setTeasForUser(this.loggedInUserEmail, this.teasForUser);
    this.updateFilteredTeas(); // Update filteredTeas after setting teasForUser
  }
}