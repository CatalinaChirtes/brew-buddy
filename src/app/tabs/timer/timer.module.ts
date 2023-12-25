import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerPage } from './timer.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TimerPageRoutingModule } from './timer-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TimerPageRoutingModule
  ],
  declarations: [TimerPage]
})
export class TimerPageModule {}
