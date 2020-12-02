import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRegisterBatchComponent } from './payment-register-batch.component';

describe('PaymentRegisterBatchComponent', () => {
  let component: PaymentRegisterBatchComponent;
  let fixture: ComponentFixture<PaymentRegisterBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRegisterBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRegisterBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
