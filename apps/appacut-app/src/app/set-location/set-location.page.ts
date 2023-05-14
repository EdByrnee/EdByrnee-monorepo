import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../core/auth';
import { RoutingService } from '../../core/routing.service';

@Component({
  selector: 'shoppr-monorepo-set-location',
  templateUrl: './set-location.page.html',
  styleUrls: ['./set-location.page.scss'],
})
export class SetLocationPage implements OnInit {
  postcode: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(7),
    Validators.minLength(4),
    Validators.pattern(
      `^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$`
    ),
  ]);

  updateBlock = false;

  constructor(
    private modalCtrl: ModalController,
    public authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private routingSerivce: RoutingService
  ) {
    this.authService.postcode$.subscribe((postcode) => {
      this.postcode.setValue(postcode);
    });
    this.postcode.valueChanges.subscribe((value) => {
      this.addSpaceAndCapitalize(value);
    });
  }

  private addSpaceAndCapitalize(value: string) {
    const hasSpace = value.includes(' ');
    if (!this.updateBlock) {
      if (value.length > 4) {
        // Remove space
        value = value.replace(/\s/g, '');
        // Add space in correct place
        value = value.replace(/.{3}$/, ' $&');
      }

      // Always uppercase
      const updatedValue = value.toUpperCase();

      this.updateBlock = true;
      this.postcode.setValue(updatedValue);
    } else {
      this.updateBlock = false;
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {}

  setPostcodeModalBreakpoint(bp: number) {
    this.routingSerivce.setPostcodeModalBreakpoint(bp);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  setPostcode() {
    this.authService.setPostcode(this.postcode.value);
    this.modalCtrl.dismiss(null, 'success');
  }

  checkPostcode() {
    this.authService.checkPostcode(this.postcode.value).subscribe((res) => {
      console.log(res);
    });
  }
}
