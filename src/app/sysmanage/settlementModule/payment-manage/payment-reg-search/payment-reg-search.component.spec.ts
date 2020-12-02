import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRegSearchComponent } from './payment-reg-search.component';

describe('PaymentRegSearchComponent', () => {
  let component: PaymentRegSearchComponent;
  let fixture: ComponentFixture<PaymentRegSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRegSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRegSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
