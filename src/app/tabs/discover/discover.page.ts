import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription, forkJoin } from 'rxjs';
import { TeaModel } from 'src/app/core/_models/teas/TeaModel';
import { TeasService } from 'src/app/core/_services/TeasService.service';
import { FilterModalPage } from 'src/app/filter-modal/filter-modal.page';

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

  teasForUser: { favoriteTeas: any[]; ownedTeas: any[] } | null = null;
  private loginSubscription: Subscription | undefined;

  constructor(
    private modalController: ModalController,
    private teasService: TeasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchTeas();
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  private fetchTeas() {
    this.route.paramMap.subscribe(params => {
      this.teasService.ApiTeasGetAll().subscribe(
        (teas: TeaModel[]) => {
          this.teas = teas;
          this.initializeTeaStates();
          this.filterItems(); 
        },
        (error) => {
          console.error('Error fetching teas:', error);
        }
      );
    });
  }

  private initializeTeaStates() {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.clickedFavoriteTea = {};
      this.clickedOwnedTea = {};

      this.teasService.ApiTeaFavouritesGet(userId).subscribe(
        (favoriteTeas: TeaModel[]) => {
          favoriteTeas.forEach(tea => this.clickedFavoriteTea[tea.name!] = true);
        },
        (error) => {
          console.error('Error fetching favorite teas:', error);
        }
      );

      this.teasService.ApiTeaOwnedGet(userId).subscribe(
        (ownedTeas: TeaModel[]) => {
          ownedTeas.forEach(tea => this.clickedOwnedTea[tea.name!] = true);
        },
        (error) => {
          console.error('Error fetching owned teas:', error);
        }
      );
    }
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
    const userId = localStorage.getItem('userId');

    if (userId) {
      if (this.clickedFavoriteTea[tea.name!]) {
        // Unfavorite tea
        this.teasService.ApiTeaFavouritesDelete(tea.id!.toString(), userId).subscribe(
          () => {
            this.clickedFavoriteTea[tea.name!] = false;
          },
          (error) => {
            console.error('Error unfavoriting tea:', error);
          }
        );
      } else {
        // Favorite tea
        this.teasService.ApiTeaFavouritesPost(tea.id!.toString(), userId).subscribe(
          () => {
            this.clickedFavoriteTea[tea.name!] = true;
          },
          (error) => {
            console.error('Error favoriting tea:', error);
          }
        );
      }
    }
  }

  toggleOwned(tea: TeaModel) {
    const userId = localStorage.getItem('userId');

    if (userId) {
      if (this.clickedOwnedTea[tea.name!]) {
        // Unown tea
        this.teasService.ApiTeaOwnedDelete(tea.id!.toString(), userId).subscribe(
          () => {
            this.clickedOwnedTea[tea.name!] = false;
          },
          (error) => {
            console.error('Error unowning tea:', error);
          }
        );
      } else {
        // Own tea
        this.teasService.ApiTeaOwnedPost(tea.id!.toString(), userId).subscribe(
          () => {
            this.clickedOwnedTea[tea.name!] = true;
          },
          (error) => {
            console.error('Error owning tea:', error);
          }
        );
      }
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterItems();
  }

  navigateToTea(tea: TeaModel) {
    console.log('Navigating to tea:', tea);
    localStorage.setItem('selectedTeaId', tea.id!.toString());
    this.router.navigate(['/app/tea', { source: 'discover' }]);
  }
}