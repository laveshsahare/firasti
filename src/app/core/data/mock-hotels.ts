import { Hotel } from '../models/hotel.model';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 1,
    name: 'Azure Bay Resort',
    location: 'Goa, India',
    pricePerNight: 7200,
    rating: 4.7,
    featured: true,
    description: 'A breezy beach resort with sea-facing rooms, curated dining, and fast access to North Goa nightlife.',
    amenities: ['Sea view', 'Pool', 'Spa', 'Airport pickup', 'Breakfast included'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 2,
    name: 'Himalayan Cedar Retreat',
    location: 'Manali, India',
    pricePerNight: 5400,
    rating: 4.5,
    featured: true,
    description: 'A mountain hideaway with warm interiors, valley views, and guided treks from the property.',
    amenities: ['Mountain view', 'Bonfire', 'Heated rooms', 'Free Wi-Fi', 'Trek desk'],
    images: [
      'https://images.unsplash.com/photo-1517320964276-a002fa203177?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 3,
    name: 'The Metro Grand',
    location: 'Mumbai, India',
    pricePerNight: 8900,
    rating: 4.3,
    description: 'Business-friendly stay near Bandra Kurla Complex with sharp rooms and all-day dining.',
    amenities: ['Business center', 'Gym', 'Rooftop lounge', 'Valet parking', 'Late checkout'],
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 4,
    name: 'Lakefront Palace',
    location: 'Udaipur, India',
    pricePerNight: 11200,
    rating: 4.8,
    featured: true,
    description: 'A refined lakeside hotel with heritage styling, sunset boat rides, and polished hospitality.',
    amenities: ['Lake view', 'Fine dining', 'Heritage rooms', 'Boat ride', 'Concierge'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];
