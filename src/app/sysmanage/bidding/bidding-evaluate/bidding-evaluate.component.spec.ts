import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddingEvaluateComponent } from './bidding-evaluate.component';

describe('BiddingEvaluateComponent', () => {
  let component: BiddingEvaluateComponent;
  let fixture: ComponentFixture<BiddingEvaluateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiddingEvaluateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiddingEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
