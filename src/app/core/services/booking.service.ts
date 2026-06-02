import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Booking,
  BookingPayload,
  PaymentOrderResponse,
  PaymentStatusResponse,
  VerifyPaymentPayload
} from '../models/booking.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly baseUrl = `${environment.apiUrl}/bookings`;
  private readonly storageKey = 'veena_bookings';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  createBooking(payload: BookingPayload): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, payload).pipe(
      tap((booking) => this.saveLocalBooking(booking)),
      catchError((error) => throwError(() => error))
    );
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/my`).pipe(
      tap((bookings) => this.saveLocalBookings(bookings)),
      catchError(() => of(this.readLocalBookings()))
    );
  }

  getLocalBookingById(id: number): Booking | undefined {
    return this.readLocalBookings().find((booking) => booking.id === id);
  }

  createPaymentOrder(bookingId: number): Observable<PaymentOrderResponse> {
    return this.http.post<PaymentOrderResponse>(`${environment.apiUrl}/payments/bookings/${bookingId}/order`, {}).pipe(
      tap((payment) => this.patchLocalBooking(bookingId, {
        paymentGateway: payment.gateway,
        paymentOrderId: payment.orderId,
        paymentStatus: payment.status
      }))
    );
  }

  verifyPayment(bookingId: number, payload: VerifyPaymentPayload): Observable<PaymentStatusResponse> {
    return this.http.post<PaymentStatusResponse>(`${environment.apiUrl}/payments/bookings/${bookingId}/verify`, payload).pipe(
      tap((payment) => this.patchLocalBooking(bookingId, {
        status: payment.status === 'SUCCESS' ? 'CONFIRMED' : payment.status === 'FAILED' ? 'CANCELLED' : 'PENDING',
        paymentStatus: payment.status,
        paymentId: payment.paymentId
      }))
    );
  }

  getPaymentStatus(bookingId: number): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(`${environment.apiUrl}/payments/bookings/${bookingId}/status`).pipe(
      tap((payment) => this.patchLocalBooking(bookingId, {
        status: payment.status === 'SUCCESS' ? 'CONFIRMED' : payment.status === 'FAILED' ? 'CANCELLED' : 'PENDING',
        paymentStatus: payment.status,
        paymentId: payment.paymentId
      }))
    );
  }

  private saveLocalBooking(booking: Booking): void {
    const bookings = [booking, ...this.readLocalBookings().filter((item) => item.id !== booking.id)];
    this.writeLocalBookings(bookings);
  }

  private saveLocalBookings(bookings: Booking[]): void {
    this.writeLocalBookings(bookings);
  }

  private patchLocalBooking(id: number, patch: Partial<Booking>): void {
    const bookings = this.readLocalBookings().map((booking) => booking.id === id ? { ...booking, ...patch } : booking);
    this.writeLocalBookings(bookings);
  }

  private readLocalBookings(): Booking[] {
    const rawBookings = localStorage.getItem(this.userStorageKey);
    return rawBookings ? JSON.parse(rawBookings) as Booking[] : [];
  }

  private writeLocalBookings(bookings: Booking[]): void {
    localStorage.setItem(this.userStorageKey, JSON.stringify(bookings));
  }

  private get userStorageKey(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${this.storageKey}_${user.id}` : this.storageKey;
  }
}
