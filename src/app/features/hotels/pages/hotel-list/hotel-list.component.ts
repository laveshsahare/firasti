import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Hotel } from '../../../../core/models/hotel.model';
import { HotelQuery, HotelService } from '../../../../core/services/hotel.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss',
  standalone: false
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  errorMessage = '';
  filtersForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute
  ) {
    this.filtersForm = this.fb.group({
      location: [''],
      maxPrice: [15000],
      minRating: [0],
      sort: ['']
    });
  }

  ngOnInit(): void {
    const location = this.route.snapshot.queryParamMap.get('location') ?? '';
    this.filtersForm.patchValue({ location });
    this.loadHotels();
  }

  loadHotels(): void {
    const raw = this.filtersForm.getRawValue();
    const query: HotelQuery = {
      location: raw.location ?? '',
      maxPrice: Number(raw.maxPrice),
      minRating: Number(raw.minRating),
      sort: raw.sort === 'priceAsc' ? 'priceAsc' : undefined
    };

    this.hotelService.getHotels(query).subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load hotels. Please try again.';
      }
    });
  }
}
