import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Booking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  standalone: false
})
export class PaymentComponent implements OnInit {
  booking?: Booking;
  paymentQrImageUrl = '';
  paymentMessage = 'Create a secure Razorpay payment for this booking.';
  errorMessage = '';
  successMessage = '';
  isCreatingPage = false;
  isVerifyingPage = false;
  isCreatingQr = false;
  isCreatingOrder = false;
  isVerifyingPayment = false;
  isCheckingStatus = false;
  bookingId = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    this.booking = this.bookingService.getLocalBookingById(this.bookingId);
    this.verifyReturnedPaymentPage();
  }

  get payableAmount(): number {
    const unitPrice = Number(this.booking?.price ?? 0);
    const count = Number(this.booking?.guests ?? this.booking?.passengers ?? 1);
    return unitPrice * Math.max(1, count);
  }

  payOnRazorpayPage(): void {
    if (!this.bookingId || this.isCreatingPage || this.isVerifyingPage) {
      return;
    }

    this.isCreatingPage = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.paymentMessage = 'Creating your Razorpay payment page...';
    this.bookingService.createPaymentPage(this.bookingId).subscribe({
      next: (payment) => {
        this.isCreatingPage = false;
        window.location.href = payment.paymentUrl;
      },
      error: (error) => {
        this.isCreatingPage = false;
        this.paymentMessage = 'Create a secure Razorpay payment for this booking.';
        this.errorMessage = this.readErrorMessage(error, 'Unable to create Razorpay payment page. Check backend Razorpay credentials.');
      }
    });
  }

  payWithRazorpay(): void {
    if (!this.bookingId || this.isCreatingOrder || this.isVerifyingPayment) {
      return;
    }

    this.isCreatingOrder = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.bookingService.createPaymentOrder(this.bookingId).subscribe({
      next: (order) => {
        this.isCreatingOrder = false;
        this.openCheckout(order);
      },
      error: (error) => {
        this.isCreatingOrder = false;
        this.errorMessage = this.readErrorMessage(error, 'Unable to create Razorpay payment. Check backend Razorpay credentials.');
      }
    });
  }

  private verifyReturnedPaymentPage(): void {
    const query = this.route.snapshot.queryParamMap;
    const paymentId = query.get('razorpay_payment_id');
    const paymentLinkId = query.get('razorpay_payment_link_id');
    const paymentLinkReferenceId = query.get('razorpay_payment_link_reference_id');
    const paymentLinkStatus = query.get('razorpay_payment_link_status');
    const signature = query.get('razorpay_signature');

    if (!paymentId || !paymentLinkId || !paymentLinkReferenceId || !paymentLinkStatus || !signature || !this.bookingId) {
      return;
    }

    this.isVerifyingPage = true;
    this.paymentMessage = 'Verifying Razorpay payment...';
    this.errorMessage = '';
    this.successMessage = '';

    this.bookingService.verifyPaymentPage(this.bookingId, {
      razorpayPaymentId: paymentId,
      razorpayPaymentLinkId: paymentLinkId,
      razorpayPaymentLinkReferenceId: paymentLinkReferenceId,
      razorpayPaymentLinkStatus: paymentLinkStatus,
      razorpaySignature: signature
    }).subscribe({
      next: (payment) => {
        this.isVerifyingPage = false;
        this.paymentMessage = payment.message;
        this.successMessage = payment.status === 'SUCCESS' ? payment.message : '';
        if (this.booking) {
          this.booking = {
            ...this.booking,
            status: payment.status === 'SUCCESS' ? 'CONFIRMED' : payment.status === 'FAILED' ? 'CANCELLED' : 'PENDING',
            paymentStatus: payment.status,
            paymentId: payment.paymentId
          };
        }
      },
      error: (error) => {
        this.isVerifyingPage = false;
        this.paymentMessage = 'Payment verification failed.';
        this.errorMessage = this.readErrorMessage(error, 'Payment page verification failed.');
      }
    });
  }

  createRazorpayQr(): void {
    if (!this.bookingId) {
      return;
    }

    this.isCreatingQr = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.bookingService.createPaymentQr(this.bookingId).subscribe({
      next: (payment) => {
        this.isCreatingQr = false;
        this.paymentQrImageUrl = payment.imageUrl;
        this.paymentMessage = payment.message;
        this.errorMessage = '';
      },
      error: (error) => {
        this.isCreatingQr = false;
        this.paymentQrImageUrl = '';
        this.paymentMessage = 'Unable to create Razorpay QR';
        this.errorMessage = this.readErrorMessage(error, 'Razorpay QR Codes API could not create a fixed-amount QR for this account.');
      }
    });
  }

  checkPaymentStatus(): void {
    if (!this.bookingId || this.isCheckingStatus) {
      return;
    }

    this.isCheckingStatus = true;
    this.errorMessage = '';
    this.bookingService.getPaymentStatus(this.bookingId).subscribe({
      next: (payment) => {
        this.isCheckingStatus = false;
        this.paymentMessage = payment.message;
        this.successMessage = payment.status === 'SUCCESS' ? payment.message : '';
        if (this.booking) {
          this.booking = {
            ...this.booking,
            paymentStatus: payment.status,
            paymentId: payment.paymentId,
            status: payment.status === 'SUCCESS' ? 'CONFIRMED' : payment.status === 'FAILED' ? 'CANCELLED' : 'PENDING'
          };
        }
      },
      error: (error) => {
        this.isCheckingStatus = false;
        this.errorMessage = this.readErrorMessage(error, 'Unable to check payment status.');
      }
    });
  }

  private openCheckout(order: {
    keyId: string;
    amountInPaise: number;
    currency: string;
    name: string;
    description: string;
    orderId: string;
    prefillName: string;
    prefillEmail: string;
  }): void {
    this.loadRazorpayCheckout().then(() => {
      if (!window.Razorpay) {
        this.errorMessage = 'Razorpay Checkout could not be loaded.';
        return;
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amountInPaise,
        currency: order.currency,
        name: order.name,
        description: order.description,
        order_id: order.orderId,
        prefill: {
          name: order.prefillName,
          email: order.prefillEmail
        },
        theme: {
          color: '#006ce4'
        },
        handler: (response) => this.verifyRazorpayPayment(response),
        modal: {
          ondismiss: () => {
            this.paymentMessage = 'Payment was closed before completion.';
          }
        }
      });
      checkout.open();
    }).catch(() => {
      this.errorMessage = 'Razorpay Checkout could not be loaded.';
    });
  }

  private verifyRazorpayPayment(response: RazorpaySuccessResponse): void {
    this.isVerifyingPayment = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.bookingService.verifyPayment(this.bookingId, {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    }).subscribe({
      next: (payment) => {
        this.isVerifyingPayment = false;
        this.successMessage = payment.message;
        this.paymentMessage = payment.message;
        if (this.booking) {
          this.booking = {
            ...this.booking,
            status: 'CONFIRMED',
            paymentStatus: 'SUCCESS',
            paymentId: payment.paymentId
          };
        }
      },
      error: (error) => {
        this.isVerifyingPayment = false;
        this.errorMessage = this.readErrorMessage(error, 'Payment verification failed.');
      }
    });
  }

  private loadRazorpayCheckout(): Promise<void> {
    if (window.Razorpay) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }

  private readErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const response = (error as { error?: { detail?: string; message?: string; error?: string } }).error;
      return response?.detail || response?.message || response?.error || fallback;
    }

    return fallback;
  }
}
