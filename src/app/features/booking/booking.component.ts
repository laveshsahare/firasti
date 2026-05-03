import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Bus } from '../../core/models/bus.model';
import { Flight } from '../../core/models/flight.model';
import { Hotel } from '../../core/models/hotel.model';
import { BookingService } from '../../core/services/booking.service';
import { BusService } from '../../core/services/bus.service';
import { FlightService } from '../../core/services/flight.service';
import { HotelService } from '../../core/services/hotel.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  standalone: false
})
export class BookingComponent implements OnInit {
  hotel?: Hotel;
  flight?: Flight;
  bus?: Bus;
  bookingType: 'hotel' | 'flight' | 'bus' = 'hotel';
  successMessage = '';
  errorMessage = '';
  bookingForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly hotelService: HotelService,
    private readonly flightService: FlightService,
    private readonly busService: BusService,
    private readonly bookingService: BookingService
  ) {
    this.bookingForm = this.fb.group({
      guestName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      departureDate: [''],
      returnDate: [''],
      guests: [1, [Validators.required, Validators.min(1), Validators.max(8)]]
    });
  }

  ngOnInit(): void {
    const hotelId = Number(this.route.snapshot.paramMap.get('hotelId'));
    const flightId = Number(this.route.snapshot.paramMap.get('flightId'));
    const busId = Number(this.route.snapshot.paramMap.get('busId'));

    if (flightId) {
      this.prepareTransportBooking('flight');
      this.flightService.getFlightById(flightId).subscribe((flight) => {
        this.flight = flight;
      });
      return;
    }

    if (busId) {
      this.prepareTransportBooking('bus');
      this.busService.getBusById(busId).subscribe((bus) => {
        this.bus = bus;
      });
      return;
    }

    this.hotelService.getHotelById(hotelId).subscribe((hotel) => {
      this.hotel = hotel;
    });
  }

  confirmBooking(): void {
    if (!this.hasBookingTarget || this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const basePayload = {
      guestName: this.bookingForm.controls.guestName.value ?? '',
      email: this.bookingForm.controls.email.value ?? '',
      guests: Number(this.bookingForm.controls.guests.value),
      passengers: Number(this.bookingForm.controls.guests.value)
    };
    const payload = this.buildPayload(basePayload);

    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => {
        this.successMessage = `${this.productLabel} booking confirmed. Continue to payment.`;
        this.errorMessage = '';
        void this.router.navigate(['/booking/payment', booking.id]);
      },
      error: () => {
        this.errorMessage = 'Unable to confirm booking. Please try again.';
      }
    });
  }

  get hasBookingTarget(): boolean {
    return Boolean(this.hotel || this.flight || this.bus);
  }

  get title(): string {
    if (this.bookingType === 'flight') {
      return 'Confirm your flight';
    }

    if (this.bookingType === 'bus') {
      return 'Confirm your bus';
    }

    return 'Confirm your stay';
  }

  get productLabel(): string {
    return this.bookingType === 'hotel' ? 'Hotel' : this.bookingType === 'flight' ? 'Flight' : 'Bus';
  }

  get missingMessage(): string {
    return `Choose a ${this.bookingType} before booking.`;
  }

  private prepareTransportBooking(type: 'flight' | 'bus'): void {
    this.bookingType = type;
    this.bookingForm.controls.checkIn.clearValidators();
    this.bookingForm.controls.checkOut.clearValidators();
    this.bookingForm.controls.departureDate.setValidators(Validators.required);
    this.bookingForm.patchValue({
      departureDate: this.route.snapshot.queryParamMap.get('departureDate') ?? ''
    });
    this.bookingForm.controls.checkIn.updateValueAndValidity();
    this.bookingForm.controls.checkOut.updateValueAndValidity();
    this.bookingForm.controls.departureDate.updateValueAndValidity();
  }

  private buildPayload(basePayload: {
    guestName: string;
    email: string;
    guests: number;
    passengers: number;
  }) {
    if (this.bookingType === 'flight' && this.flight) {
      return {
        ...basePayload,
        productType: 'flight' as const,
        flightId: this.flight.id,
        title: this.flight.airline,
        route: `${this.flight.from} to ${this.flight.to}`,
        travelDate: this.bookingForm.controls.departureDate.value ?? '',
        price: this.flight.price,
        departureDate: this.bookingForm.controls.departureDate.value ?? '',
        returnDate: this.bookingForm.controls.returnDate.value ?? ''
      };
    }

    if (this.bookingType === 'bus' && this.bus) {
      return {
        ...basePayload,
        productType: 'bus' as const,
        busId: this.bus.id,
        title: this.bus.operator,
        route: `${this.bus.from} to ${this.bus.to}`,
        travelDate: this.bookingForm.controls.departureDate.value ?? '',
        price: this.bus.price,
        departureDate: this.bookingForm.controls.departureDate.value ?? '',
        returnDate: this.bookingForm.controls.returnDate.value ?? ''
      };
    }

    return {
      ...basePayload,
      productType: 'hotel' as const,
      hotelId: this.hotel?.id,
      title: this.hotel?.name,
      route: this.hotel?.location,
      travelDate: this.bookingForm.controls.checkIn.value ?? '',
      price: this.hotel?.pricePerNight,
      checkIn: this.bookingForm.controls.checkIn.value ?? '',
      checkOut: this.bookingForm.controls.checkOut.value ?? ''
    };
  }
}
