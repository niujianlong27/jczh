import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOilComponent } from './payment-oil.component';

describe('PaymentOilComponent', () => {
  let component: PaymentOilComponent;
  let fixture: ComponentFixture<PaymentOilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentOilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
