import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookingComponent } from './booking.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: 'history',
    component: BookingHistoryComponent
  },
  {
    path: 'payment/:bookingId',
    component: PaymentComponent
  },
  {
    path: 'hotel/:hotelId',
    component: BookingComponent
  },
  {
    path: 'flight/:flightId',
    component: BookingComponent
  },
  {
    path: 'bus/:busId',
    component: BookingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {}
