import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MOCK_FLIGHTS } from '../data/mock-flights';
import { Flight } from '../models/flight.model';

export interface FlightQuery {
  from?: string;
  to?: string;
  cabinClass?: string;
  maxPrice?: number;
  sort?: 'priceAsc' | 'duration';
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly baseUrl = `${environment.apiUrl}/flights`;

  constructor(private readonly http: HttpClient) {}

  getFlights(query: FlightQuery = {}): Observable<Flight[]> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<Flight[]>(this.baseUrl, { params }).pipe(
      catchError(() => of(MOCK_FLIGHTS)),
      map((flights) => this.applyClientFilters(flights, query))
    );
  }

  getFlightById(id: number): Observable<Flight | undefined> {
    return this.http.get<Flight>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of(MOCK_FLIGHTS.find((flight) => flight.id === id)))
    );
  }

  createFlight(payload: Omit<Flight, 'id'>): Observable<Flight> {
    return this.http.post<Flight>(this.baseUrl, payload).pipe(
      catchError(() => of({ ...payload, id: Date.now() }))
    );
  }

  updateFlight(id: number, payload: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.baseUrl}/${id}`, payload).pipe(
      catchError(() => of(payload))
    );
  }

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(() => of(void 0)));
  }

  private applyClientFilters(flights: Flight[], query: FlightQuery): Flight[] {
    let result = [...flights];

    if (query.from) {
      const term = query.from.toLowerCase();
      result = result.filter((flight) => flight.from.toLowerCase().includes(term));
    }

    if (query.to) {
      const term = query.to.toLowerCase();
      result = result.filter((flight) => flight.to.toLowerCase().includes(term));
    }

    if (query.cabinClass) {
      result = result.filter((flight) => flight.cabinClass === query.cabinClass);
    }

    if (query.maxPrice) {
      result = result.filter((flight) => flight.price <= Number(query.maxPrice));
    }

    if (query.sort === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }
}
