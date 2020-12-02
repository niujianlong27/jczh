import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatisticsComponent } from './payment-statistics.component';

describe('PaymentStatisticsComponent', () => {
  let component: PaymentStatisticsComponent;
  let fixture: ComponentFixture<PaymentStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
