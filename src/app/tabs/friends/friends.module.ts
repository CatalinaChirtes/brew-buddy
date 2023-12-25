import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FriendsPageRoutingModule } from './friends-routing.module';
import { FriendsPage } from './friends.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    FriendsPageRoutingModule
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
