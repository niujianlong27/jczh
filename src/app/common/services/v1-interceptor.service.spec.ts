import { TestBed } from '@angular/core/testing';

import { V1InterceptorService } from './v1-interceptor.service';

describe('V1InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: V1InterceptorService = TestBed.get(V1InterceptorService);
    expect(service).toBeTruthy();
  });
});
