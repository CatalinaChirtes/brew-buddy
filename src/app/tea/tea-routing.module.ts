import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeaPage } from './tea.page';

const routes: Routes = [
  {
    path: '',
    component: TeaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeaPageRoutingModule {}
