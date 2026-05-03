import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Hotel } from '../../../../core/models/hotel.model';
import { HotelService } from '../../../../core/services/hotel.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.scss',
  standalone: false
})
export class HotelDetailComponent implements OnInit {
  hotel?: Hotel;
  selectedImage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly hotelService: HotelService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.hotelService.getHotelById(id).subscribe((hotel) => {
      this.hotel = hotel;
      this.selectedImage = hotel?.images[0] ?? '';
    });
  }
}
