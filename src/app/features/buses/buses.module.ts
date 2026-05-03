import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { BusesRoutingModule } from './buses-routing.module';
import { BusListComponent } from './pages/bus-list/bus-list.component';

@NgModule({
  declarations: [BusListComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    BusesRoutingModule
  ]
})
export class BusesModule {}
