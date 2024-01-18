import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeaModel } from 'src/app/core/_models/teas/TeaModel';
import { TeasService } from 'src/app/core/_services/TeasService.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  teas: TeaModel[] = [];

  constructor(
    private teasService: TeasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchTeas();
  }

  private fetchTeas() {
    this.route.paramMap.subscribe(params => {
      const userId = localStorage.getItem('userId');
      console.log(userId);

      if (userId !== null) {
        this.teasService.ApiTeaOwnedFavouritesGet(userId).subscribe(
          (teas: TeaModel[]) => {
            this.teas = teas;
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
    this.router.navigate(['/app/tea']);
  }

}
