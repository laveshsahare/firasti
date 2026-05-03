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
}
