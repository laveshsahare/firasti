import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MOCK_BUSES } from '../data/mock-buses';
import { Bus } from '../models/bus.model';

export interface BusQuery {
  from?: string;
  to?: string;
  busType?: string;
  maxPrice?: number;
  sort?: 'priceAsc';
}

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private readonly baseUrl = `${environment.apiUrl}/buses`;

  constructor(private readonly http: HttpClient) {}

  getBuses(query: BusQuery = {}): Observable<Bus[]> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<Bus[]>(this.baseUrl, { params }).pipe(
      catchError(() => of(MOCK_BUSES)),
      map((buses) => this.applyClientFilters(buses, query))
    );
  }

  getBusById(id: number): Observable<Bus | undefined> {
    return this.http.get<Bus>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of(MOCK_BUSES.find((bus) => bus.id === id)))
    );
  }

  createBus(payload: Omit<Bus, 'id'>): Observable<Bus> {
    return this.http.post<Bus>(this.baseUrl, payload).pipe(
      catchError(() => of({ ...payload, id: Date.now() }))
    );
  }

  updateBus(id: number, payload: Bus): Observable<Bus> {
    return this.http.put<Bus>(`${this.baseUrl}/${id}`, payload).pipe(
      catchError(() => of(payload))
    );
  }

  deleteBus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(() => of(void 0)));
  }

  private applyClientFilters(buses: Bus[], query: BusQuery): Bus[] {
    let result = [...buses];

    if (query.from) {
      const term = query.from.toLowerCase();
      result = result.filter((bus) => bus.from.toLowerCase().includes(term));
    }

    if (query.to) {
      const term = query.to.toLowerCase();
      result = result.filter((bus) => bus.to.toLowerCase().includes(term));
    }

    if (query.busType) {
      result = result.filter((bus) => bus.busType === query.busType);
    }

    if (query.maxPrice) {
      result = result.filter((bus) => bus.price <= Number(query.maxPrice));
    }

    if (query.sort === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }
}
