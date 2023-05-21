import { Injectable } from '@angular/core';
import { IDropItem } from '@shoppr-monorepo/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { DropsService } from './drops';

@Injectable({
  providedIn: 'root',
})
export class DropItemsService {
  public api = environment.api;

  public currentUserDropItems$: BehaviorSubject<IDropItem[]> =
    new BehaviorSubject<IDropItem[]>([]);

  constructor(
    private http: HttpClient,
    private dropService: DropsService
    ) {}

  getDropItemsForCurrentUser() {
    return this.http.get<IDropItem[]>(`${this.api}/api/drops/items/current-user`).pipe(
      tap((dropItems) => {
        this.currentUserDropItems$.next(dropItems)
        // Now we have this data we might as well reconsile this with the drops
        const currentDrops = this.dropService.allDrops$.getValue();
        
      })
      
    )
  }
  
}
