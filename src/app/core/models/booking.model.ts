import { Hotel } from './hotel.model';
import { Flight } from './flight.model';
import { Bus } from './bus.model';

export interface BookingPayload {
  productType?: 'hotel' | 'flight' | 'bus';
  hotelId?: number;
  flightId?: number;
  busId?: number;
  title?: string;
  route?: string;
  travelDate?: string;
  price?: number;
  guestName: string;
  email: string;
  checkIn?: string;
  checkOut?: string;
  departureDate?: string;
  returnDate?: string;
  guests?: number;
  passengers?: number;
}

export interface Booking extends BookingPayload {
  id: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  hotel?: Hotel;
  flight?: Flight;
  bus?: Bus;
  totalAmount?: number;
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentGateway?: string;
  paymentOrderId?: string;
  paymentLinkId?: string;
  paymentLinkUrl?: string;
  paymentQrId?: string;
  paymentQrImageUrl?: string;
  paymentId?: string;
}

export interface PaymentOrderResponse {
  bookingId: number;
  gateway: string;
  keyId: string;
  orderId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  name: string;
  description: string;
  prefillName: string;
  prefillEmail: string;
}

export interface PaymentPageResponse {
  bookingId: number;
  gateway: string;
  paymentLinkId: string;
  paymentUrl: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

export interface VerifyPaymentLinkPayload {
  razorpayPaymentId: string;
  razorpayPaymentLinkId: string;
  razorpayPaymentLinkReferenceId: string;
  razorpayPaymentLinkStatus: string;
  razorpaySignature: string;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentQrResponse {
  bookingId: number;
  gateway: string;
  qrId: string;
  imageUrl: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  message: string;
}

export interface PaymentStatusResponse {
  bookingId: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentId?: string;
  message: string;
}
