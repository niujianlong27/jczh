import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkReverseShipmentAddComponent } from './stock-bulk-reverse-shipment-add.component';

describe('StockBulkReverseShipmentAddComponent', () => {
  let component: StockBulkReverseShipmentAddComponent;
  let fixture: ComponentFixture<StockBulkReverseShipmentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkReverseShipmentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkReverseShipmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
