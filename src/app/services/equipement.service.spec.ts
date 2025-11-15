import { TestBed } from '@angular/core/testing';

import { EquipementService } from './equipement.service';

describe('EquipementService', () => {
  let service: EquipementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
