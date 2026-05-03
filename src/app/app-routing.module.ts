import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'hotels',
    loadChildren: () => import('./features/hotels/hotels.module').then((m) => m.HotelsModule)
  },
  {
    path: 'flights',
    loadChildren: () => import('./features/flights/flights.module').then((m) => m.FlightsModule)
  },
  {
    path: 'buses',
    loadChildren: () => import('./features/buses/buses.module').then((m) => m.BusesModule)
  },
  {
    path: 'booking/:hotelId',
    redirectTo: 'booking/hotel/:hotelId'
  },
  {
    path: 'booking',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/booking/booking.module').then((m) => m.BookingModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
