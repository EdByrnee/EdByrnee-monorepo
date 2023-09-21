import { TestBed } from '@angular/core/testing';

import { DelliDropsService } from './delli-drops.service';

describe('DelliDropsService', () => {
  let service: DelliDropsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelliDropsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
