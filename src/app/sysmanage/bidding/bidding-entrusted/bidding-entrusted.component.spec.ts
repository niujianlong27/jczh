import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddingEntrustedComponent } from './bidding-entrusted.component';

describe('BiddingEntrustedComponent', () => {
  let component: BiddingEntrustedComponent;
  let fixture: ComponentFixture<BiddingEntrustedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiddingEntrustedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiddingEntrustedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
