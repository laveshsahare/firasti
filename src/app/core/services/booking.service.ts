import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Booking,
  BookingPayload,
  PaymentOrderResponse,
  PaymentPageResponse,
  PaymentQrResponse,
  PaymentStatusResponse,
  VerifyPaymentLinkPayload,
  VerifyPaymentPayload
} from '../models/booking.model';

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
      catchError((error) => throwError(() => error))
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

  createPaymentOrder(bookingId: number): Observable<PaymentOrderResponse> {
    return this.http.post<PaymentOrderResponse>(`${environment.apiUrl}/payments/bookings/${bookingId}/order`, {}).pipe(
      tap((payment) => this.patchLocalBooking(bookingId, {
        paymentGateway: payment.gateway,
        paymentOrderId: payment.orderId,
        paymentStatus: payment.status
      }))
    );
  }

  createPaymentPage(bookingId: number): Observable<PaymentPageResponse> {
    return this.http.post<PaymentPageResponse>(`${environment.apiUrl}/payments/bookings/${bookingId}/page`, {}).pipe(
      tap((payment) => this.patchLocalBooking(bookingId, {
        paymentGateway: payment.gateway,
        paymentLinkId: payment.paymentLinkId,
        paymentLinkUrl: payment.paymentUrl,
        paymentStatus: payment.status
      }))
    );
  }

  verifyPaymentPage(bookingId: number, payload: VerifyPaymentLinkPayload): Observable<PaymentStatusResponse> {
    return this.http.post<PaymentStatusResponse>(`${environment.apiUrl}/payments/bookings/${bookingId}/page/verify`, payload).pipe(
      tap((payment) => this.patchLocalBooking(bookingId, {
        status: payment.status === 'SUCCESS' ? 'CONFIRMED' : payment.status === 'FAILED' ? 'CANCELLED' : 'PENDING',
        paymentStatus: payment.status,
        paymentId: payment.paymentId
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

  createPaymentQr(bookingId: number): Observable<PaymentQrResponse> {
    return this.http.post<PaymentQrResponse>(`${environment.apiUrl}/payments/bookings/${bookingId}/qr`, {}).pipe(
      tap((payment) => this.patchLocalBooking(bookingId, {
        paymentGateway: payment.gateway,
        paymentQrId: payment.qrId,
        paymentQrImageUrl: payment.imageUrl,
        paymentStatus: payment.status
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
    localStorage.setItem(this.storageKey, JSON.stringify(bookings));
  }

  private patchLocalBooking(id: number, patch: Partial<Booking>): void {
    const bookings = this.readLocalBookings().map((booking) => booking.id === id ? { ...booking, ...patch } : booking);
    localStorage.setItem(this.storageKey, JSON.stringify(bookings));
  }

  private readLocalBookings(): Booking[] {
    const rawBookings = localStorage.getItem(this.storageKey);
    return rawBookings ? JSON.parse(rawBookings) as Booking[] : [];
  }
}
