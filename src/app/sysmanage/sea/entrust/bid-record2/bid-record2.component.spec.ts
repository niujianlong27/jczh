import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidRecord2Component } from './bid-record2.component';

describe('BidRecord2Component', () => {
  let component: BidRecord2Component;
  let fixture: ComponentFixture<BidRecord2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidRecord2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidRecord2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
