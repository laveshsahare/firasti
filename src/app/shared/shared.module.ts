import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HotelCardComponent } from './components/hotel-card/hotel-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    FooterComponent,
    HotelCardComponent,
    LoaderComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe
  ],
  exports: [
    CommonModule,
    FooterComponent,
    HotelCardComponent,
    LoaderComponent,
    NavbarComponent
  ]
})
export class SharedModule {}
