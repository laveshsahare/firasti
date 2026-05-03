import { Flight } from '../models/flight.model';

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: 101,
    airline: 'IndiGo',
    flightNumber: '6E 204',
    from: 'Delhi',
    to: 'Goa',
    departureTime: '06:20',
    arrivalTime: '08:55',
    duration: '2h 35m',
    stops: 0,
    price: 6499,
    rating: 4.4,
    cabinClass: 'Economy'
  },
  {
    id: 102,
    airline: 'Air India',
    flightNumber: 'AI 681',
    from: 'Mumbai',
    to: 'Bengaluru',
    departureTime: '09:10',
    arrivalTime: '10:55',
    duration: '1h 45m',
    stops: 0,
    price: 5290,
    rating: 4.2,
    cabinClass: 'Economy'
  },
  {
    id: 103,
    airline: 'Vistara',
    flightNumber: 'UK 747',
    from: 'Delhi',
    to: 'Mumbai',
    departureTime: '13:25',
    arrivalTime: '15:40',
    duration: '2h 15m',
    stops: 0,
    price: 8200,
    rating: 4.7,
    cabinClass: 'Premium Economy'
  },
  {
    id: 104,
    airline: 'Akasa Air',
    flightNumber: 'QP 1431',
    from: 'Bengaluru',
    to: 'Goa',
    departureTime: '18:05',
    arrivalTime: '19:20',
    duration: '1h 15m',
    stops: 0,
    price: 4700,
    rating: 4.1,
    cabinClass: 'Economy'
  },
  {
    id: 105,
    airline: 'Air India Express',
    flightNumber: 'IX 932',
    from: 'Kochi',
    to: 'Delhi',
    departureTime: '21:10',
    arrivalTime: '01:35',
    duration: '4h 25m',
    stops: 1,
    price: 9900,
    rating: 4.0,
    cabinClass: 'Business'
  }
];
