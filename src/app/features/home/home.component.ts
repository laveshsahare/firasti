import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Hotel } from '../../core/models/hotel.model';
import { HotelService } from '../../core/services/hotel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent implements OnInit {
  featuredHotels: Hotel[] = [];
  activeSearch: 'hotels' | 'flights' | 'buses' = 'hotels';
  searchForm;
  flightSearchForm;
  busSearchForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly hotelService: HotelService,
    private readonly router: Router
  ) {
    this.searchForm = this.fb.group({
      location: ['', [Validators.required, Validators.minLength(2)]],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required]
    });
    this.flightSearchForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      departureDate: ['', Validators.required]
    });
    this.busSearchForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      departureDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.hotelService.getHotels().subscribe((hotels) => {
      this.featuredHotels = hotels.filter((hotel) => hotel.featured).slice(0, 3);
    });
  }

  search(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const { location, checkIn, checkOut } = this.searchForm.getRawValue();
    void this.router.navigate(['/hotels'], {
      queryParams: {
        location,
        checkIn,
        checkOut
      }
    });
  }

  searchFlights(): void {
    if (this.flightSearchForm.invalid) {
      this.flightSearchForm.markAllAsTouched();
      return;
    }

    void this.router.navigate(['/flights'], {
      queryParams: this.flightSearchForm.getRawValue()
    });
  }

  searchBuses(): void {
    if (this.busSearchForm.invalid) {
      this.busSearchForm.markAllAsTouched();
      return;
    }

    void this.router.navigate(['/buses'], {
      queryParams: this.busSearchForm.getRawValue()
    });
  }
}
