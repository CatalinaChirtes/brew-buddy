import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: 'timer.page.html',
  styleUrls: ['timer.page.scss']
})
export class TimerPage implements OnDestroy {
  constructor() {}

  audio: HTMLAudioElement = new Audio('assets/sounds/timer_ding.mp3');

  currentDuration: number = 60; 
  displayTime: string = '01:00';
  customDuration: number = 1; 
  timerRunning: boolean = false;
  timerStopped: boolean = false;
  timerFinished: boolean = false;
  timerId: any;
  remainingTime: number = 0;

  startTimer() {
    if (!this.timerRunning) {
      this.timerRunning = true;
      this.timerStopped = false;
      this.timerFinished = false;
      this.currentDuration = this.remainingTime > 0 ? this.remainingTime : this.customDuration * 60;
      this.timerId = setInterval(() => {
        if (this.currentDuration >= 0) {
          this.displayTime = this.formatTime(this.currentDuration);
          this.currentDuration--;
        } else {
          this.timerRunning = false;
          this.timerFinished = true;
          clearInterval(this.timerId);
          this.playNotificationSound();
        }
      }, 1000);
    }
  }

  playNotificationSound() {
    this.audio.play();
  }

  pauseTimer() {
    if (this.timerRunning) {
      this.timerRunning = false;
      this.timerStopped = true;
      clearInterval(this.timerId);
      this.remainingTime = this.currentDuration;
    }
  }

  resetTimer() {
    this.timerRunning = false;
    this.timerStopped = false;
    this.timerFinished = false;
    clearInterval(this.timerId);
    this.currentDuration = this.customDuration * 60;
    this.displayTime = this.formatTime(this.currentDuration);
    this.remainingTime = 0;
  }

  setCustomDuration() {
    if (!this.timerRunning) {
      this.currentDuration = this.customDuration * 60;
      this.displayTime = this.formatTime(this.currentDuration);
      this.remainingTime = 0; 
    }
  }

  continueTimer() {
    this.startTimer();
    this.timerStopped=false;
  }

  formatTime(seconds: number): string {
    const mins: string = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs: string = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  ngOnDestroy() {
    clearInterval(this.timerId);
  }
}
