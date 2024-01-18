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
  teaTimers: { [key: string]: TeaTimer } = {};

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

      if (userId !== null) {
        this.teasService.ApiTeaOwnedFavouritesGet(userId).subscribe(
          (teas: TeaModel[]) => {
            this.teas = teas;

            this.teas.forEach(tea => {
              this.teaTimers[tea.id!.toString()] = new TeaTimer(tea);
            });
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
    this.router.navigate(['/app/tea', { source: 'home' }]);
  }

  ngOnDestroy() {
    Object.values(this.teaTimers).forEach(timer => timer.clearTimer());
  }
}

class TeaTimer {
  tea: TeaModel;
  audio: HTMLAudioElement = new Audio('assets/sounds/timer_ding.mp3');
  timerMaxId: any;
  currentMaxDuration: number = 60; 
  displayMaxTime: string = '';
  timerMaxRunning: boolean = false;
  timerMaxStopped: boolean = false;
  timerMaxFinished: boolean = false;
  remainingMaxTime: number = 0;

  constructor(tea: TeaModel) {
    this.tea = tea;
    this.initializeTimer();
  }

  private initializeTimer() {
    this.currentMaxDuration = (this.tea.max_infuzion ?? 1) * 60;
    this.displayMaxTime = this.formatTime(this.currentMaxDuration);
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

  clearTimer() {
    clearInterval(this.timerMaxId);
  }
}
