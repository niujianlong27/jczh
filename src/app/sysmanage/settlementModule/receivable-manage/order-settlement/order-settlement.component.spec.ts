import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSettlementComponent } from './order-settlement.component';

describe('OrderSettlementComponent', () => {
  let component: OrderSettlementComponent;
  let fixture: ComponentFixture<OrderSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
