import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage {
  categories: { name: string, checked: boolean }[] = [];

  constructor(private modalController: ModalController) {}

  applyFilters() {
    this.modalController.dismiss({
      categories: this.categories
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
