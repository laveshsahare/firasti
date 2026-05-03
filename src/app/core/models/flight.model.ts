export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  rating: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business';
}
