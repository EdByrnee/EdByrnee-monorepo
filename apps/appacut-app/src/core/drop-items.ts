import { Injectable } from '@angular/core';
import { IDropItem } from '@shoppr-monorepo/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DropItemsService {
  public api = environment.api;

  public currentUserDropItems$: BehaviorSubject<IDropItem[]> =
    new BehaviorSubject<IDropItem[]>([]);

  constructor(private http: HttpClient) {}

  getDropItemsForCurrentUser() {
    return this.http.get<IDropItem[]>(`${this.api}/api/drops/items/current-user`).pipe(
      tap((dropItems) => this.currentUserDropItems$.next(dropItems))
    )
  }
}
