import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HotelDetailComponent } from './pages/hotel-detail/hotel-detail.component';
import { HotelListComponent } from './pages/hotel-list/hotel-list.component';

const routes: Routes = [
  {
    path: '',
    component: HotelListComponent
  },
  {
    path: ':id',
    component: HotelDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelsRoutingModule {}
