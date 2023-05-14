import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shoppr-monorepo-gallery-toggle-component',
  templateUrl: './gallery-toggle-component.component.html',
  styleUrls: ['./gallery-toggle-component.component.scss'],
})
export class GalleryToggleComponentComponent implements OnInit {

  viewGallery = false;
  constructor() {}

  ngOnInit(): void {}
}
