import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingOrderComponent } from './shipping-order.component';

describe('ShippingOrderComponent', () => {
  let component: ShippingOrderComponent;
  let fixture: ComponentFixture<ShippingOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
