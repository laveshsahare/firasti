import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { HotelsRoutingModule } from './hotels-routing.module';
import { HotelDetailComponent } from './pages/hotel-detail/hotel-detail.component';
import { HotelListComponent } from './pages/hotel-list/hotel-list.component';

@NgModule({
  declarations: [
    HotelDetailComponent,
    HotelListComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    HotelsRoutingModule
  ]
})
export class HotelsModule {}
