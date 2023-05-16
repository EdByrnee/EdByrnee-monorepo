import { Component, OnInit } from '@angular/core';
import { DropsService } from '../../core/drops';
import { IDrop } from '@shoppr-monorepo/api-interfaces';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'shoppr-monorepo-select-drop',
  templateUrl: './select-drop.page.html',
  styleUrls: ['./select-drop.page.scss'],
})
export class SelectDropPage implements OnInit {
  itemCode = '';

  allDrops$ = this.dropService.allDrops$;

  drop: IDrop | null;

  constructor(
    private dropService: DropsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.dropService.getDrops();
  }

  onSubmit() {
    console.log(this.itemCode);
  }

  onCancel() {
    this.modalController.dismiss();
  }

  searchForDrop($event: any) {
    const itemCode = $event.target.value;
    console.log(`Searching for ${itemCode}`)
    const drops = this.dropService.allDrops$.getValue();

    const drop = drops.find((drop) => drop.itemCode === itemCode);

    if (drop) {
      console.log(`Found drop ${drop.itemCode}`)
      this.drop = drop;
    } else {
      this.drop = null;
    }
  }
}
