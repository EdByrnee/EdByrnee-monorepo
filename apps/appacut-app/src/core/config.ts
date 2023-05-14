import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  api = environment.api;

  public remoteConfig$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
  }

  getMobileAppConfig() {
    console.log(`Getting mobile config`);
    return this.http.get(this.api + '/api/remote-config/mobile-app').pipe(
      tap((res: any) => {
        console.log(`Got mobile config: ${res}`)
        this.remoteConfig$.next(res);
      })
    );
  }
}
