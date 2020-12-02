import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReverseShipmentComponent } from './stock-reverse-shipment.component';

describe('StockReverseShipmentComponent', () => {
  let component: StockReverseShipmentComponent;
  let fixture: ComponentFixture<StockReverseShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReverseShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReverseShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
