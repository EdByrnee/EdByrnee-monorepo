import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropsService } from '../../core/drops';

@Component({
  selector: 'shoppr-monorepo-new-drop-collection-address',
  templateUrl: './new-drop-collection-address.page.html',
  styleUrls: ['./new-drop-collection-address.page.scss'],
})
export class NewDropCollectionAddressPage implements OnInit {

  public collectionForm: FormGroup = this.dropService.collectionForm;

  constructor(private dropService: DropsService) {}

  ngOnInit() {}
}
