import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropsService } from '../../core/drops';
import { MapsService } from '../../core/maps.service';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'shoppr-monorepo-set-local-delivery-radius',
  templateUrl: './set-local-delivery-radius.page.html',
  styleUrls: ['./set-local-delivery-radius.page.scss'],
})
export class SetLocalDeliveryRadiusPage implements OnInit {
  constructor(
    private dropService: DropsService,
    private cdRef: ChangeDetectorRef,
    private mapService: MapsService,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  @ViewChild('circleRef', { static: false })
  circleRef: ElementRef<google.maps.Circle>;

  @ViewChild('mapRef', { static: false })
  mapRef: google.maps.Map;

  localDeliveryForm: FormGroup = this.dropService.localDeliveryForm;

  postcode = 'l12 8rd';

  _radius = 1000;

  set radius(value: number) {
    console.log(this.circleRef);
    console.log(`Setting radius to ${value}`);
    this._radius = value;
    this.circleRef.nativeElement.setRadius(value);
    this.cdRef.detectChanges();
  }

  get radius(): number {
    return this._radius;
  }

  mapOptions: any = this.mapService.getDemoMapOptions();
  circleOptions: google.maps.CircleOptions = {
    center: this.mapService.getDemoLatLng(),
    radius: this.radius,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
  };

  ngOnInit() {}

  onRangeChange($event: any) {
    this.radius = $event.detail.value;
  }


  boundsToKm(bounds: google.maps.LatLngBounds):number {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const radius = google.maps.geometry.spherical.computeDistanceBetween(ne, sw) / 2;
    return radius / 2;
  }

  async confirm() {
    const bounds = this.mapRef.getBounds() as google.maps.LatLngBounds;
    console.log(`Bounds was ${bounds}`)
    const radius = this.boundsToKm(bounds);
    this.dropService.localDeliveryForm.controls['localDeliveryRadius'].setValue(Number(radius));

    const center = this.mapRef.getCenter() as google.maps.LatLng;
    const lat = center.lat().toFixed(6);
    const lng = center.lng().toFixed(6);

    this.dropService.localDeliveryForm.patchValue({
      localDeliveryLat: Number(lat),
      localDeliveryLng: Number(lng),
    } as any)

    console.log(`Marking form as dirty`)
    this.dropService.localDeliveryForm.markAsDirty();


    // console print the localDeliveryForm
    console.log(this.dropService.localDeliveryForm.value);
    await this.modalController.dismiss();
  }
}
