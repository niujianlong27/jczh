import { TestBed } from '@angular/core/testing';

import { ContainerHeightService } from './container-height.service';

describe('ContainerHeightService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContainerHeightService = TestBed.get(ContainerHeightService);
    expect(service).toBeTruthy();
  });
});
