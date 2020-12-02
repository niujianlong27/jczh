import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVerificationComponent } from './payment-verification.component';

describe('PaymentVerificationComponent', () => {
  let component: PaymentVerificationComponent;
  let fixture: ComponentFixture<PaymentVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
