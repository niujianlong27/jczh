import { TestBed, inject } from '@angular/core/testing';

import { SimpleCacheService } from './simple-cache.service';

describe('SimpleCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimpleCacheService]
    });
  });

  it('should be created', inject([SimpleCacheService], (service: SimpleCacheService) => {
    expect(service).toBeTruthy();
  }));
});
