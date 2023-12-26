import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterModalPage } from 'src/app/filter-modal/filter-modal.page';

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

  constructor(private modalController: ModalController) {}

  teas = [
    { name: 'Flavored Raspberry Tart', category: 'Ceai verde', imageURL: 'https://cdn.dc5.ro/img-prod/1659730-0.jpeg' },
    { name: 'Raspberry & Flowers', category: 'Infuzie de fructe', imageURL: 'https://cdn.dc5.ro/img-prod/1976979-0.jpeg' },
    { name: 'Chocolate Cream Truffles', category: 'Ceai negru', imageURL: 'https://cdn.dc5.ro/img-prod/439661-0.jpg' },
    { name: 'Strawberry Banana', category: 'Ceai rosu - Rooibos', imageURL: 'https://cdn.dc5.ro/img-prod/2000000140544-1715608.jpg' },
    { name: 'Classic Spicy Cocktail', category: 'Infuzie de fructe', imageURL: 'https://cdn.dc5.ro/img-prod/97420-0.jpeg' },
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
}
