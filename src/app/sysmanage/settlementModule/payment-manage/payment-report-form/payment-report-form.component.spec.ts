import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReportFormComponent } from './payment-report-form.component';

describe('PaymentReportFormComponent', () => {
  let component: PaymentReportFormComponent;
  let fixture: ComponentFixture<PaymentReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
