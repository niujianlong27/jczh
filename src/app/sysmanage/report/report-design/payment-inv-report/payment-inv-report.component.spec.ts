import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInvReportComponent } from './payment-inv-report.component';

describe('PaymentInvReportComponent', () => {
  let component: PaymentInvReportComponent;
  let fixture: ComponentFixture<PaymentInvReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentInvReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInvReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
