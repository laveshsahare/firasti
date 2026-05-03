import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Booking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  standalone: false
})
export class PaymentComponent implements OnInit {
  booking?: Booking;
  paymentMode: 'card' | 'upi' | 'netbanking' = 'card';
  successMessage = '';
  paymentForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookingService: BookingService
  ) {
    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]],
      upiId: ['', Validators.pattern(/^[\w.-]+@[\w.-]+$/)],
      bank: ['']
    });
  }

  ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    this.booking = this.bookingService.getLocalBookingById(bookingId);
  }

  setPaymentMode(mode: 'card' | 'upi' | 'netbanking'): void {
    this.paymentMode = mode;
    this.successMessage = '';
  }

  payNow(): void {
    if (this.paymentMode === 'card' && this.hasInvalidControls(['cardName', 'cardNumber', 'expiry', 'cvv'])) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (this.paymentMode === 'upi' && this.hasInvalidControls(['upiId'])) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.successMessage = 'Payment successful. Your booking is fully confirmed.';
    setTimeout(() => {
      void this.router.navigate(['/booking/history']);
    }, 900);
  }

  get payableAmount(): number {
    const unitPrice = Number(this.booking?.price ?? 0);
    const count = Number(this.booking?.guests ?? this.booking?.passengers ?? 1);
    return unitPrice * Math.max(1, count);
  }

  private hasInvalidControls(controlNames: string[]): boolean {
    return controlNames.some((name) => this.paymentForm.get(name)?.invalid);
  }
}
