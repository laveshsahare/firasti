import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    BookingComponent,
    BookingHistoryComponent,
    PaymentComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    BookingRoutingModule
  ]
})
export class BookingModule {}
