import { Injectable } from '@angular/core';
import {
  DropStatus,
  ICreateDropItem,
  IDrop,
  IDropFeed,
  IDropItem,
  IUpdateDrop,
} from '@shoppr-monorepo/api-interfaces';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DropsService {
  public api = environment.api;

  public dropFeed$: BehaviorSubject<IDropFeed[]> = new BehaviorSubject<
    IDropFeed[]
  >([]);
  public allDrops$: BehaviorSubject<IDrop[]> = new BehaviorSubject<IDrop[]>([]);

  public deliveryMethods = new FormGroup({});

  public isLocalDeliveryAreaSet = false;

  public importantInfoForm = new FormGroup({
    ingredients: new FormControl('', [Validators.required]),
    allergens: new FormControl('', [Validators.required]),
    age_restricted: new FormControl(false, []),
    food_authgranted: new FormControl(null, [Validators.requiredTrue]),
  });

  public localDeliveryForm = new FormGroup({
    localDeliveryCost: new FormControl(null, [Validators.required]),
    localDeliveryGuidelines: new FormControl(null, [Validators.required]),
    localDeliveryLat: new FormControl(null, [Validators.required]),
    localDeliveryLng: new FormControl(null, [Validators.required]),
    localDeliveryRadius: new FormControl(100, [Validators.required]),
  });

  public nationalDeliveryForm = new FormGroup({
    nationalDeliveryCost: new FormControl(null, [Validators.required]),
    nationalDeliveryGuidelines: new FormControl(null, [Validators.required]),
  });

  public collectionForm = new FormGroup({
    collectionGuidelines: new FormControl(null, [Validators.required]),
    collectionAddressLine1: new FormControl(null, [Validators.required]),
    collectionAddressLine2: new FormControl(null, []),
    collectionAddressCity: new FormControl(null, [Validators.required]),
    collectionAddressPostcode: new FormControl(null, [Validators.required]),
  });

  constructor(private http: HttpClient) {
    this.localDeliveryForm.disable();
    this.nationalDeliveryForm.disable();
    this.collectionForm.disable();

    this.localDeliveryForm.valueChanges.subscribe((res) => {
      if (
        res.localDeliveryLat &&
        res.localDeliveryLng &&
        res.localDeliveryRadius
      ) {
        this.isLocalDeliveryAreaSet = true;
      } else {
        this.isLocalDeliveryAreaSet = false;
      }
    });
  }

  getDrops() {
    console.log(`getDrops()`);
    return this.http.get<IDrop[]>(this.api + '/api/drops').pipe(
      tap((res: IDrop[]) => {
        console.log(`Here are all the drops`);
        console.log(res);
        this.allDrops$.next(res);
      })
    );
  }

  updateStatus(uuid: string, status: DropStatus) {
    return this.http.patch(this.api + '/api/drops/' + uuid + '/status', {
      status,
    });
  }

  getDropsByMaker(id: string): Observable<IDrop[]> {
    return this.http.get<IDrop[]>(this.api + '/api/drops/maker/' + id);
  }

  searchDrops(searchTerm: string): Observable<IDrop[]> {
    return this.http.get<IDrop[]>(this.api + '/api/drops/search/' + searchTerm);
  }

  getDropFeed() {
    return this.http.get<IDropFeed[]>(this.api + '/api/drops/feed/v2').pipe(
      tap((res: IDropFeed[]) => {
        this.dropFeed$.next(res);
      })
    );
  }

  private updateItemDrop(dropItemUuid: string, updates: Partial<IDropItem>) {
    const dropItems = this.allDrops$.value.map((drop) => drop.dropItems).flat();

    const dropItem = dropItems.find(
      (dropItem) => dropItem?.uuid === dropItemUuid
    );

    Object.assign(dropItem as any, updates);

    this.allDrops$.next(this.allDrops$.value);
  }

  updateItemDropLocation(
    dropItemUuid: string,
    locationOrDriverUuid: string,
    withDriver: boolean
  ) {
    return this.http
      .patch(this.api + '/api/drops/items/' + dropItemUuid + '/location', {
        locationOrDriverUuid,
        withDriver,
      })
      .pipe(
        tap((res: any) => {
          if (withDriver) {
            this.updateItemDrop(dropItemUuid, {
              withDriver: true,
              driverUuid: locationOrDriverUuid,
              location: null,
            });
          } else {
            this.updateItemDrop(dropItemUuid, {
              withDriver: false,
              driverUuid: null as any,
              location: locationOrDriverUuid,
            });
          }
        })
      );
  }

  replenishWareshouseStock(dropUuid: string, newDropItems: ICreateDropItem[]) {
    return this.http.patch(
      this.api + '/api/drops/' + dropUuid + '/replenish-warehouse',
      newDropItems
    );
  }

  private convertFileToBlob(file: File): Blob {
    const fileBlob = new Blob([file], { type: file.type });
    return fileBlob;
  }

  createDrop(drop: IDrop, photos: Blob[]): Observable<any> {
    // Attach the photo array to the create drop request
    const formData = new FormData();
    formData.append('drop', JSON.stringify(drop));
    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }

    // Create and send the request
    console.log(`Loggin formData`);
    console.log(formData);
    const req = new HttpRequest('POST', this.api + '/api/drops', formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  updateDrop(
    updates: IUpdateDrop,
    dropUuid: string,
    newImages: Blob[]
  ): Observable<any> {
    // Attach the photo array to the create drop request
    const formData = new FormData();
    formData.append('updates', JSON.stringify(updates));
    for (let i = 0; i < newImages.length; i++) {
      formData.append('photos', newImages[i]);
    }

    // Create and send the request
    console.log(`Loggin formData`);
    console.log(formData);
    const req = new HttpRequest(
      'PATCH',
      this.api + '/api/drops/' + dropUuid,
      formData,
      {
        // reportProgress: true,
      }
    );
    return this.http.request(req);
  }

  getDrop(id: string) {
    return this.http.get<IDrop>(this.api + '/api/drops/' + id);
  }

  getDirtyValues(form: any) {
    const dirtyValues: any = {};

    Object.keys(form.controls).forEach((key) => {
      const currentControl = form.controls[key];

      if (currentControl.dirty) {
        if (currentControl.controls)
          dirtyValues[key] = this.getDirtyValues(currentControl);
        else dirtyValues[key] = currentControl.value;
      }
    });

    return dirtyValues;
  }
}
