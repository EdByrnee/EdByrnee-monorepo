import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DelliDropsService {
  api = environment.api;
  drops$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  delliDropScrapeLogs$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) {}

  getDelliDrops(): Observable<any> {
    console.log('getDelliDrops()');
    return this.http.get(`${this.api}/reporting/delli-drops`).pipe(
      map((drops: any) => {
        return drops.map((drop: any) => {
          drop.total_sales = drop.sales * (drop.price / 100);
          return drop;
        });
      }),
      tap((drops) => {
        this.drops$.next(drops);
      })
    );
  }

  getDelliDropScrapeLogs() {
    return this.http
      .get(`${this.api}/reporting/scrape-logs?scrapeName=delli-drops`)
      .pipe(
        tap((scrapeLogs) => {
          this.delliDropScrapeLogs$.next(scrapeLogs);
        })
      );
  }
}
