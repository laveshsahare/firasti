import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Booking, BookingPayload } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly baseUrl = `${environment.apiUrl}/bookings`;
  private readonly storageKey = 'veena_bookings';

  constructor(private readonly http: HttpClient) {}

  createBooking(payload: BookingPayload): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, payload).pipe(
      tap((booking) => this.saveLocalBooking(booking)),
      catchError(() => of<Booking>({
        ...payload,
        id: Date.now(),
        status: 'CONFIRMED'
      }).pipe(tap((booking) => this.saveLocalBooking(booking))))
    );
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/my`).pipe(
      catchError(() => of(this.readLocalBookings()))
    );
  }

  getLocalBookingById(id: number): Booking | undefined {
    return this.readLocalBookings().find((booking) => booking.id === id);
  }

  private saveLocalBooking(booking: Booking): void {
    const bookings = [booking, ...this.readLocalBookings().filter((item) => item.id !== booking.id)];
    localStorage.setItem(this.storageKey, JSON.stringify(bookings));
  }

  private readLocalBookings(): Booking[] {
    const rawBookings = localStorage.getItem(this.storageKey);
    return rawBookings ? JSON.parse(rawBookings) as Booking[] : [];
  }
}
