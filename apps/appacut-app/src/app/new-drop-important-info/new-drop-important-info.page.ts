import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DropsService } from '../../core/drops';

@Component({
  selector: 'shoppr-monorepo-new-drop-important-info',
  templateUrl: './new-drop-important-info.page.html',
  styleUrls: ['./new-drop-important-info.page.scss'],
})
export class NewDropImportantInfoPage implements OnInit {

  importantInfoForm: FormGroup;

  constructor(
    private dropService: DropsService,
    private navController: NavController
    ) {
    this.importantInfoForm = this.dropService.importantInfoForm;
  }

  ngOnInit() {}

  save(){
    this.navController.pop();
  }
}
