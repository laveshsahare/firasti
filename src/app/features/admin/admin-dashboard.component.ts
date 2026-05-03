import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Bus } from '../../core/models/bus.model';
import { Flight } from '../../core/models/flight.model';
import { Hotel } from '../../core/models/hotel.model';
import { BusService } from '../../core/services/bus.service';
import { FlightService } from '../../core/services/flight.service';
import { HotelService } from '../../core/services/hotel.service';

type AdminTab = 'hotels' | 'flights' | 'buses';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  activeTab: AdminTab = 'hotels';
  hotels: Hotel[] = [];
  flights: Flight[] = [];
  buses: Bus[] = [];
  editingHotelId: number | null = null;
  editingFlightId: number | null = null;
  editingBusId: number | null = null;
  message = '';
  hotelForm;
  flightForm;
  busForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly hotelService: HotelService,
    private readonly flightService: FlightService,
    private readonly busService: BusService
  ) {
    this.hotelForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      pricePerNight: [3000, [Validators.required, Validators.min(500)]],
      rating: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      description: ['', [Validators.required, Validators.minLength(12)]],
      amenities: ['Wi-Fi, Breakfast'],
      imageUrl: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', Validators.required],
      featured: [false]
    });
    this.flightForm = this.fb.group({
      airline: ['', Validators.required],
      flightNumber: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      duration: ['', Validators.required],
      stops: [0, [Validators.required, Validators.min(0)]],
      price: [4000, [Validators.required, Validators.min(500)]],
      rating: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      cabinClass: ['Economy', Validators.required]
    });
    this.busForm = this.fb.group({
      operator: ['', Validators.required],
      busNumber: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      duration: ['', Validators.required],
      busType: ['AC Sleeper', Validators.required],
      seatsAvailable: [20, [Validators.required, Validators.min(1)]],
      price: [900, [Validators.required, Validators.min(100)]],
      rating: [4, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.loadInventory();
  }

  setTab(tab: AdminTab): void {
    this.activeTab = tab;
    this.message = '';
  }

  loadInventory(): void {
    this.hotelService.getHotels().subscribe((hotels) => {
      this.hotels = hotels;
    });
    this.flightService.getFlights().subscribe((flights) => {
      this.flights = flights;
    });
    this.busService.getBuses().subscribe((buses) => {
      this.buses = buses;
    });
  }

  saveHotel(): void {
    if (this.hotelForm.invalid) {
      this.hotelForm.markAllAsTouched();
      return;
    }

    const raw = this.hotelForm.getRawValue();
    const payload: Omit<Hotel, 'id'> = {
      name: raw.name ?? '',
      location: raw.location ?? '',
      pricePerNight: Number(raw.pricePerNight),
      rating: Number(raw.rating),
      description: raw.description ?? '',
      amenities: (raw.amenities ?? '').split(',').map((item) => item.trim()).filter(Boolean),
      images: [raw.imageUrl ?? ''],
      featured: Boolean(raw.featured)
    };

    const request$ = this.editingHotelId
      ? this.hotelService.updateHotel(this.editingHotelId, { ...payload, id: this.editingHotelId })
      : this.hotelService.createHotel(payload);

    request$.subscribe((hotel) => {
      this.hotels = this.editingHotelId
        ? this.hotels.map((item) => item.id === hotel.id ? hotel : item)
        : [hotel, ...this.hotels];
      this.message = this.editingHotelId ? 'Hotel updated successfully.' : 'Hotel added successfully.';
      this.resetHotelForm();
    });
  }

  saveFlight(): void {
    if (this.flightForm.invalid) {
      this.flightForm.markAllAsTouched();
      return;
    }

    const raw = this.flightForm.getRawValue();
    const payload: Omit<Flight, 'id'> = {
      airline: raw.airline ?? '',
      flightNumber: raw.flightNumber ?? '',
      from: raw.from ?? '',
      to: raw.to ?? '',
      departureTime: raw.departureTime ?? '',
      arrivalTime: raw.arrivalTime ?? '',
      duration: raw.duration ?? '',
      stops: Number(raw.stops),
      price: Number(raw.price),
      rating: Number(raw.rating),
      cabinClass: (raw.cabinClass ?? 'Economy') as Flight['cabinClass']
    };

    const request$ = this.editingFlightId
      ? this.flightService.updateFlight(this.editingFlightId, { ...payload, id: this.editingFlightId })
      : this.flightService.createFlight(payload);

    request$.subscribe((flight) => {
      this.flights = this.editingFlightId
        ? this.flights.map((item) => item.id === flight.id ? flight : item)
        : [flight, ...this.flights];
      this.message = this.editingFlightId ? 'Flight updated successfully.' : 'Flight added successfully.';
      this.resetFlightForm();
    });
  }

  saveBus(): void {
    if (this.busForm.invalid) {
      this.busForm.markAllAsTouched();
      return;
    }

    const raw = this.busForm.getRawValue();
    const payload: Omit<Bus, 'id'> = {
      operator: raw.operator ?? '',
      busNumber: raw.busNumber ?? '',
      from: raw.from ?? '',
      to: raw.to ?? '',
      departureTime: raw.departureTime ?? '',
      arrivalTime: raw.arrivalTime ?? '',
      duration: raw.duration ?? '',
      busType: (raw.busType ?? 'AC Sleeper') as Bus['busType'],
      seatsAvailable: Number(raw.seatsAvailable),
      price: Number(raw.price),
      rating: Number(raw.rating)
    };

    const request$ = this.editingBusId
      ? this.busService.updateBus(this.editingBusId, { ...payload, id: this.editingBusId })
      : this.busService.createBus(payload);

    request$.subscribe((bus) => {
      this.buses = this.editingBusId
        ? this.buses.map((item) => item.id === bus.id ? bus : item)
        : [bus, ...this.buses];
      this.message = this.editingBusId ? 'Bus updated successfully.' : 'Bus added successfully.';
      this.resetBusForm();
    });
  }

  editHotel(hotel: Hotel): void {
    this.activeTab = 'hotels';
    this.editingHotelId = hotel.id;
    this.message = '';
    this.hotelForm.patchValue({
      name: hotel.name,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight,
      rating: hotel.rating,
      description: hotel.description,
      amenities: hotel.amenities.join(', '),
      imageUrl: hotel.images[0],
      featured: Boolean(hotel.featured)
    });
  }

  editFlight(flight: Flight): void {
    this.activeTab = 'flights';
    this.editingFlightId = flight.id;
    this.message = '';
    this.flightForm.patchValue(flight);
  }

  editBus(bus: Bus): void {
    this.activeTab = 'buses';
    this.editingBusId = bus.id;
    this.message = '';
    this.busForm.patchValue(bus);
  }

  deleteHotel(hotel: Hotel): void {
    this.hotelService.deleteHotel(hotel.id).subscribe(() => {
      this.hotels = this.hotels.filter((item) => item.id !== hotel.id);
      this.message = `${hotel.name} deleted.`;
    });
  }

  deleteFlight(flight: Flight): void {
    this.flightService.deleteFlight(flight.id).subscribe(() => {
      this.flights = this.flights.filter((item) => item.id !== flight.id);
      this.message = `${flight.airline} ${flight.flightNumber} deleted.`;
    });
  }

  deleteBus(bus: Bus): void {
    this.busService.deleteBus(bus.id).subscribe(() => {
      this.buses = this.buses.filter((item) => item.id !== bus.id);
      this.message = `${bus.operator} ${bus.busNumber} deleted.`;
    });
  }

  resetHotelForm(): void {
    this.editingHotelId = null;
    this.hotelForm.reset({
      pricePerNight: 3000,
      rating: 4,
      amenities: 'Wi-Fi, Breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      featured: false
    });
  }

  resetFlightForm(): void {
    this.editingFlightId = null;
    this.flightForm.reset({
      stops: 0,
      price: 4000,
      rating: 4,
      cabinClass: 'Economy'
    });
  }

  resetBusForm(): void {
    this.editingBusId = null;
    this.busForm.reset({
      busType: 'AC Sleeper',
      seatsAvailable: 20,
      price: 900,
      rating: 4
    });
  }
}
