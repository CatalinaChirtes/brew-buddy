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

  constructor(
    private teasService: TeasService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.fetchTea();
    this.setCustomMinDuration();
    this.setCustomMaxDuration();
  }

  private fetchTea() {
    this.route.paramMap.subscribe(params => {
      const teaId = localStorage.getItem('selectedTeaId');
      console.log(teaId);

      if (teaId !== null) {
        this.teasService.ApiTeaGet(teaId).subscribe(
          (tea: TeaModel) => {
            this.tea = tea;

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
  navigateToDiscover() {
    this.resetMaxTimer();
    this.resetMinTimer();
    this.router.navigate(['/app/discover']);
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
}

