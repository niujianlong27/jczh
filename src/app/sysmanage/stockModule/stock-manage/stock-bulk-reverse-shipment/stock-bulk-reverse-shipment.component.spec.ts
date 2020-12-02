import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkReverseShipmentComponent } from './stock-bulk-reverse-shipment.component';

describe('StockBulkReverseShipmentComponent', () => {
  let component: StockBulkReverseShipmentComponent;
  let fixture: ComponentFixture<StockBulkReverseShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkReverseShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkReverseShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
