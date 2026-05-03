import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MOCK_HOTELS } from '../data/mock-hotels';
import { Hotel } from '../models/hotel.model';

export interface HotelQuery {
  location?: string;
  minRating?: number;
  maxPrice?: number;
  sort?: 'priceAsc';
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly baseUrl = `${environment.apiUrl}/hotels`;

  constructor(private readonly http: HttpClient) {}

  getHotels(query: HotelQuery = {}): Observable<Hotel[]> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<Hotel[]>(this.baseUrl, { params }).pipe(
      catchError(() => of(MOCK_HOTELS)),
      map((hotels) => this.applyClientFilters(hotels, query))
    );
  }

  getHotelById(id: number): Observable<Hotel | undefined> {
    return this.http.get<Hotel>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of(MOCK_HOTELS.find((hotel) => hotel.id === id)))
    );
  }

  createHotel(payload: Omit<Hotel, 'id'>): Observable<Hotel> {
    return this.http.post<Hotel>(this.baseUrl, payload).pipe(
      catchError(() => of({ ...payload, id: Date.now() }))
    );
  }

  updateHotel(id: number, payload: Hotel): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.baseUrl}/${id}`, payload).pipe(
      catchError(() => of(payload))
    );
  }

  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(() => of(void 0)));
  }

  private applyClientFilters(hotels: Hotel[], query: HotelQuery): Hotel[] {
    let result = [...hotels];

    if (query.location) {
      const term = query.location.toLowerCase();
      result = result.filter((hotel) => hotel.location.toLowerCase().includes(term));
    }

    if (query.minRating) {
      result = result.filter((hotel) => hotel.rating >= Number(query.minRating));
    }

    if (query.maxPrice) {
      result = result.filter((hotel) => hotel.pricePerNight <= Number(query.maxPrice));
    }

    if (query.sort === 'priceAsc') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    }

    return result;
  }
}
