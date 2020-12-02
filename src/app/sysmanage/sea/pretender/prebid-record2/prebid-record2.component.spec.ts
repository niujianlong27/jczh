import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebidRecord2Component } from './prebid-record2.component';

describe('PrebidRecord2Component', () => {
  let component: PrebidRecord2Component;
  let fixture: ComponentFixture<PrebidRecord2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrebidRecord2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrebidRecord2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
