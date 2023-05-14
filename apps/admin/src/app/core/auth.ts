import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.api;

  public isAuthed$ = new BehaviorSubject<boolean>(false);
  public token = localStorage.getItem('access_token');

  public suggestedMakers$: BehaviorSubject<IUserProfile[]> =
    new BehaviorSubject<IUserProfile[]>([]);

  public currentUser$: BehaviorSubject<IUserProfile | null> =
    new BehaviorSubject<IUserProfile | null>(null);

  public demoMode$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const isAuthed = this.isTokenSet();
    this.isAuthed$.next(isAuthed);
  }

  private isTokenSet(): boolean {
    return (
      localStorage.getItem('access_token') !== null &&
      localStorage.getItem('access_token') !== undefined &&
      localStorage.getItem('access_token') !== 'null'
    );
  }

  public async getAccessToken(): Promise<string | null> {
    return Promise.resolve(localStorage.getItem('access_token'));
  }

  async logout(clearPostcode: boolean = false) {
    if (clearPostcode) localStorage.clear();
    this.isAuthed$.next(false);

    // localStorage.removeItem('access_token');
  }
}
