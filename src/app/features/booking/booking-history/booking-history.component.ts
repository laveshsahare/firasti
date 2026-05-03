import { Component, OnInit } from '@angular/core';

import { Booking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.scss',
  standalone: false
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  errorMessage = '';

  constructor(private readonly bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load your bookings. Please try again.';
      }
    });
  }

  bookingLabel(booking: Booking): string {
    const productType = this.normalizedProductType(booking);

    if (productType === 'flight') {
      return 'Flight';
    }

    if (productType === 'bus') {
      return 'Bus';
    }

    return 'Hotel';
  }

  normalizedProductType(booking: Booking): 'hotel' | 'flight' | 'bus' {
    return String(booking.productType ?? 'hotel').toLowerCase() as 'hotel' | 'flight' | 'bus';
  }

  dateLabel(booking: Booking): string {
    return booking.travelDate ?? booking.departureDate ?? booking.checkIn ?? 'Date pending';
  }
}
