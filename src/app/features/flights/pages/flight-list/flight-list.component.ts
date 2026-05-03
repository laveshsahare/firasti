import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Flight } from '../../../../core/models/flight.model';
import { FlightQuery, FlightService } from '../../../../core/services/flight.service';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.scss',
  standalone: false
})
export class FlightListComponent implements OnInit {
  flights: Flight[] = [];
  errorMessage = '';
  searchForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly flightService: FlightService,
    private readonly route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      from: [''],
      to: [''],
      departureDate: [''],
      cabinClass: [''],
      maxPrice: [15000],
      sort: ['priceAsc']
    });
  }

  ngOnInit(): void {
    this.searchForm.patchValue({
      from: this.route.snapshot.queryParamMap.get('from') ?? '',
      to: this.route.snapshot.queryParamMap.get('to') ?? '',
      departureDate: this.route.snapshot.queryParamMap.get('departureDate') ?? ''
    });
    this.loadFlights();
  }

  loadFlights(): void {
    const raw = this.searchForm.getRawValue();
    const query: FlightQuery = {
      from: raw.from ?? '',
      to: raw.to ?? '',
      cabinClass: raw.cabinClass ?? '',
      maxPrice: Number(raw.maxPrice),
      sort: raw.sort === 'priceAsc' ? 'priceAsc' : undefined
    };

    this.flightService.getFlights(query).subscribe({
      next: (flights) => {
        this.flights = flights;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load flights. Please try again.';
      }
    });
  }
}
