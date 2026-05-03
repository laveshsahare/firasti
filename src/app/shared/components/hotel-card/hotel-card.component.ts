import { Component, Input } from '@angular/core';

import { Hotel } from '../../../core/models/hotel.model';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss',
  standalone: false
})
export class HotelCardComponent {
  @Input({ required: true }) hotel!: Hotel;
}
