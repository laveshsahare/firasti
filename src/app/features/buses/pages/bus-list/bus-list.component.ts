import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Bus } from '../../../../core/models/bus.model';
import { BusQuery, BusService } from '../../../../core/services/bus.service';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrl: './bus-list.component.scss',
  standalone: false
})
export class BusListComponent implements OnInit {
  buses: Bus[] = [];
  errorMessage = '';
  searchForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly busService: BusService,
    private readonly route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      from: [''],
      to: [''],
      departureDate: [''],
      busType: [''],
      maxPrice: [2500],
      sort: ['priceAsc']
    });
  }

  ngOnInit(): void {
    this.searchForm.patchValue({
      from: this.route.snapshot.queryParamMap.get('from') ?? '',
      to: this.route.snapshot.queryParamMap.get('to') ?? '',
      departureDate: this.route.snapshot.queryParamMap.get('departureDate') ?? ''
    });
    this.loadBuses();
  }

  loadBuses(): void {
    const raw = this.searchForm.getRawValue();
    const query: BusQuery = {
      from: raw.from ?? '',
      to: raw.to ?? '',
      busType: raw.busType ?? '',
      maxPrice: Number(raw.maxPrice),
      sort: raw.sort === 'priceAsc' ? 'priceAsc' : undefined
    };

    this.busService.getBuses(query).subscribe({
      next: (buses) => {
        this.buses = buses;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load buses. Please try again.';
      }
    });
  }
}
