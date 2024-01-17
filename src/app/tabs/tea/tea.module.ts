import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeaPageRoutingModule } from './tea-routing.module';

import { TeaPage } from './tea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeaPageRoutingModule
  ],
  declarations: [TeaPage]
})
export class TeaPageModule {}
