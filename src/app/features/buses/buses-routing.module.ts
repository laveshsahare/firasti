import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusListComponent } from './pages/bus-list/bus-list.component';

const routes: Routes = [
  {
    path: '',
    component: BusListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusesRoutingModule {}
