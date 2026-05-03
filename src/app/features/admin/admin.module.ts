import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}
