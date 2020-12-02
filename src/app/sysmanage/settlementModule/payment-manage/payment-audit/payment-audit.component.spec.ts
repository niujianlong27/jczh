import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAuditComponent } from './payment-audit.component';

describe('PaymentAuditComponent', () => {
  let component: PaymentAuditComponent;
  let fixture: ComponentFixture<PaymentAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
