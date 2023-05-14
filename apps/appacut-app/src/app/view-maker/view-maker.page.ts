import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDrop, IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../core/auth';
import { DropsService } from '../../core/drops';
import { MessageService } from '../../core/messages';

@Component({
  selector: 'shoppr-monorepo-view-maker',
  templateUrl: './view-maker.page.html',
  styleUrls: ['./view-maker.page.scss'],
})
export class ViewMakerPage {
  id: string;

  userProfile$: Observable<IUserProfile>;
  userProfile: IUserProfile;
  loading = true;

  currentUser: IUserProfile | null;
  currentUser$ = this.authService.currentUser$.pipe(shareReplay(1));

  drops$: Observable<IDrop[]>;

  isMaker = false;
  isCurrentUser = false;

  activeDrops$: Observable<IDrop[]>;
  inactiveDrops$: Observable<IDrop[]>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private dropService: DropsService,
    private messageService: MessageService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.authService.getUserProfile(this.id).subscribe((user) => {
      this.setUserProfile(user);

      this.currentUser$.subscribe((user) => {
        this.setCurrentUser(user);
        this.loading = false;
      });
    });

    this.drops$ = this.dropService.getDropsByMaker(this.id).pipe(
      map((drops) => {
        return drops.sort((a, b) => {
          return a.status === 'ACTIVE_LISTING' ? -1 : 1;
        });
      })
    );
    this.activeDrops$ = this.drops$.pipe(
      map((drops) => drops.filter((drop) => drop.status === 'ACTIVE_LISTING'))
    );

    this.inactiveDrops$ = this.drops$.pipe(
      map((drops) => drops.filter((drop) => drop.status !== 'ACTIVE_LISTING'))
    );
  }

  setUserProfile(user: IUserProfile) {
    this.userProfile = user;
    if (this.userProfile?.maker) {
      this.isMaker = true;
    }
  }

  setCurrentUser(user: IUserProfile | null) {
    this.currentUser = user;

    if (this.currentUser?.uuid === this.userProfile.uuid) {
      this.isCurrentUser = true;
    }
  }

  subscribe() {}
  message() {
    this.messageService.openMessageThread(this.id);
  }
}
