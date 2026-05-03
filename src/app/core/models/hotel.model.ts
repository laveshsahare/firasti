export interface Hotel {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  description: string;
  amenities: string[];
  images: string[];
  featured?: boolean;
}
