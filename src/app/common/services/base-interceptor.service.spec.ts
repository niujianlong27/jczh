import { TestBed, inject } from '@angular/core/testing';

import { BaseInterceptorService } from './base-interceptor.service';

describe('BaseInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseInterceptorService]
    });
  });

  it('should be created', inject([BaseInterceptorService], (service: BaseInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
