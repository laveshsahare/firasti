import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HotelCardComponent } from './components/hotel-card/hotel-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TravelChatbotComponent } from './components/travel-chatbot/travel-chatbot.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    HotelCardComponent,
    LoaderComponent,
    TravelChatbotComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    HotelCardComponent,
    LoaderComponent,
    TravelChatbotComponent
  ]
})
export class SharedModule { }
