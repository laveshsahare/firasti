import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { FlightsRoutingModule } from './flights-routing.module';
import { FlightListComponent } from './pages/flight-list/flight-list.component';

@NgModule({
  declarations: [FlightListComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FlightsRoutingModule
  ]
})
export class FlightsModule {}
