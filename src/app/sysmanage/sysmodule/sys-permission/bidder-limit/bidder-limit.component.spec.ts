import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidderLimitComponent } from './bidder-limit.component';

describe('BidderLimitComponent', () => {
  let component: BidderLimitComponent;
  let fixture: ComponentFixture<BidderLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidderLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidderLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
