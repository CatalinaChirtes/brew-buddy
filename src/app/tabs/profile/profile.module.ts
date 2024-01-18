import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ProfilePageRoutingModule,
    MatTabsModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
