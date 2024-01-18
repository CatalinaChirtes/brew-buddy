import { Component, OnInit } from '@angular/core';
import { TeaModel } from '../../core/_models/teas/TeaModel';
import { TeasService } from '../../core/_services/TeasService.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tea',
  templateUrl: './tea.page.html',
  styleUrls: ['./tea.page.scss'],
})
export class TeaPage implements OnInit {
  public tea!: TeaModel;
  clickedFavoriteTea: { [key: string]: boolean } = {};
  clickedOwnedTea: { [key: string]: boolean } = {};
  public source: string = '';

  constructor(
    private teasService: TeasService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.fetchTea();
    this.setCustomMinDuration();
    this.setCustomMaxDuration();

    this.route.paramMap.subscribe(params => {
      const sourceParam = params.get('source');
      this.source = sourceParam !== null ? sourceParam : ''; 
      console.log('Source:', this.source);
    });
  }

  private fetchTea() {
    this.route.paramMap.subscribe(params => {
      const teaId = localStorage.getItem('selectedTeaId');
      console.log(teaId);

      if (teaId !== null) {
        this.teasService.ApiTeaGet(teaId).subscribe(
          (tea: TeaModel) => {
            this.tea = tea;

            this.initializeTeaStates();

            if(this.tea.min_infuzion == 0){
              this.displayMinTime = this.formatTime(1 * 60);
            } else {
               this.displayMinTime = this.formatTime((this.tea?.min_infuzion ?? 0) * 60);
            }
           
            this.displayMaxTime = this.formatTime((this.tea?.max_infuzion ?? 0) * 60);
          },
          (error) => {
            console.error('Error fetching tea:', error);
          }
        );
      }
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
  
  navigateBack() {
    this.resetMaxTimer();
    this.resetMinTimer();
    
    if (this.source === 'home') {
      this.router.navigate(['/app/home']);
    } else if (this.source === 'discover') {
      this.router.navigate(['/app/discover']);
    } 
  }

  audio: HTMLAudioElement = new Audio('assets/sounds/timer_ding.mp3');
  
  timerMinId: any;
  currentMinDuration: number = 60; 
  displayMinTime = this.formatTime((this.tea?.min_infuzion ?? 1) * 60);
  timerMinRunning: boolean = false;
  timerMinStopped: boolean = false;
  timerMinFinished: boolean = false;
  remainingMinTime: number = 0;

  timerMaxId: any;
  currentMaxDuration: number = 60; 
  displayMaxTime = this.formatTime((this.tea?.max_infuzion ?? 1) * 60);
  timerMaxRunning: boolean = false;
  timerMaxStopped: boolean = false;
  timerMaxFinished: boolean = false;
  remainingMaxTime: number = 0;

  startMinTimer() {
    if (!this.timerMinRunning && this.tea) {
      this.timerMinRunning = true;
      this.timerMinStopped = false;
      this.timerMinFinished = false;

      if(this.tea.min_infuzion == 0){
        this.currentMinDuration = this.remainingMinTime > 0 ? this.remainingMinTime : 1 * 60;
      } else {
        this.currentMinDuration = this.remainingMinTime > 0 ? this.remainingMinTime : (this.tea.min_infuzion ?? 1) * 60;
      }
  
      this.timerMinId = setInterval(() => {
        if (this.currentMinDuration >= 0) {
          this.displayMinTime = this.formatTime(this.currentMinDuration);
          this.currentMinDuration--;
        } else {
          this.timerMinRunning = false;
          this.timerMinFinished = true;
          clearInterval(this.timerMinId);
          this.playNotificationSound();
        }
      }, 1000);
    }
  }

  pauseMinTimer() {
    if (this.timerMinRunning) {
      this.timerMinRunning = false;
      this.timerMinStopped = true;
      clearInterval(this.timerMinId);
      this.remainingMinTime = this.currentMinDuration;
    }
  }

  resetMinTimer() {
    this.timerMinRunning = false;
    this.timerMinStopped = false;
    this.timerMinFinished = false;
    clearInterval(this.timerMinId);
    if(this.tea.min_infuzion == 0){
      this.currentMinDuration = 1 * 60;
    } else {
      this.currentMinDuration = (this.tea.min_infuzion ?? 1) * 60;
    }
    this.displayMinTime = this.formatTime(this.currentMinDuration);
    this.remainingMinTime = 0;
  }

  setCustomMinDuration() {
    if (!this.timerMinRunning && this.tea) {
      if(this.tea.min_infuzion == 0){
        this.currentMinDuration = 1 * 60;
      } else {
        this.currentMinDuration = (this.tea.min_infuzion ?? 1) * 60;
      }
      this.displayMinTime = this.formatTime(this.currentMinDuration);
      this.remainingMinTime = 0;
    }
  }

  continueMinTimer() {
    this.startMinTimer();
    this.timerMinStopped=false;
  }

  startMaxTimer() {
    if (!this.timerMaxRunning && this.tea) {
      this.timerMaxRunning = true;
      this.timerMaxStopped = false;
      this.timerMaxFinished = false;
      this.currentMaxDuration = this.remainingMaxTime > 0 ? this.remainingMaxTime : (this.tea.max_infuzion ?? 1) * 60;
  
      this.timerMaxId = setInterval(() => {
        if (this.currentMaxDuration >= 0) {
          this.displayMaxTime = this.formatTime(this.currentMaxDuration);
          this.currentMaxDuration--;
        } else {
          this.timerMaxRunning = false;
          this.timerMaxFinished = true;
          clearInterval(this.timerMaxId);
          this.playNotificationSound();
        }
      }, 1000);
    }
  }

  pauseMaxTimer() {
    if (this.timerMaxRunning) {
      this.timerMaxRunning = false;
      this.timerMaxStopped = true;
      clearInterval(this.timerMaxId);
      this.remainingMaxTime = this.currentMaxDuration;
    }
  }

  resetMaxTimer() {
    this.timerMaxRunning = false;
    this.timerMaxStopped = false;
    this.timerMaxFinished = false;
    clearInterval(this.timerMaxId);
    this.currentMaxDuration = (this.tea.max_infuzion ?? 1) * 60;
    this.displayMaxTime = this.formatTime(this.currentMaxDuration);
    this.remainingMaxTime = 0;
  }

  setCustomMaxDuration() {
    if (!this.timerMaxRunning && this.tea) {
      this.currentMaxDuration = (this.tea.max_infuzion ?? 1) * 60;
      this.displayMaxTime = this.formatTime(this.currentMaxDuration);
      this.remainingMaxTime = 0;
    }
  }

  continueMaxTimer() {
    this.startMaxTimer();
    this.timerMaxStopped=false;
  }

  playNotificationSound() {
    this.audio.play();
  }

  formatTime(seconds: number): string {
    const mins: string = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs: string = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  ngOnDestroy() {
    clearInterval(this.timerMinId);
    clearInterval(this.timerMaxId);
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
}

