export interface Bus {
  id: number;
  operator: string;
  busNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  busType: 'AC Sleeper' | 'AC Seater' | 'Volvo Multi-Axle' | 'Non-AC Sleeper';
  seatsAvailable: number;
  price: number;
  rating: number;
}
