import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSettlementComponent } from './customer-settlement.component';

describe('CustomerSettlementComponent', () => {
  let component: CustomerSettlementComponent;
  let fixture: ComponentFixture<CustomerSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
