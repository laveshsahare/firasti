import { Bus } from '../models/bus.model';

export const MOCK_BUSES: Bus[] = [
  {
    id: 201,
    operator: 'VRL Travels',
    busNumber: 'VRL 2218',
    from: 'Bengaluru',
    to: 'Goa',
    departureTime: '21:30',
    arrivalTime: '07:15',
    duration: '9h 45m',
    busType: 'Volvo Multi-Axle',
    seatsAvailable: 18,
    price: 1450,
    rating: 4.4
  },
  {
    id: 202,
    operator: 'Orange Tours',
    busNumber: 'OT 510',
    from: 'Hyderabad',
    to: 'Bengaluru',
    departureTime: '22:10',
    arrivalTime: '06:20',
    duration: '8h 10m',
    busType: 'AC Sleeper',
    seatsAvailable: 12,
    price: 1690,
    rating: 4.5
  },
  {
    id: 203,
    operator: 'IntrCity SmartBus',
    busNumber: 'IC 330',
    from: 'Delhi',
    to: 'Jaipur',
    departureTime: '07:00',
    arrivalTime: '12:15',
    duration: '5h 15m',
    busType: 'AC Seater',
    seatsAvailable: 24,
    price: 820,
    rating: 4.2
  },
  {
    id: 204,
    operator: 'Neeta Tours',
    busNumber: 'NT 118',
    from: 'Mumbai',
    to: 'Pune',
    departureTime: '17:30',
    arrivalTime: '21:05',
    duration: '3h 35m',
    busType: 'AC Seater',
    seatsAvailable: 31,
    price: 650,
    rating: 4.0
  }
];
