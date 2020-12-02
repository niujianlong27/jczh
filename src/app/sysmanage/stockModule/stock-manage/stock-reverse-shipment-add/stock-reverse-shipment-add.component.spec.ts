import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReverseShipmentAddComponent } from './stock-reverse-shipment-add.component';

describe('StockReverseShipmentAddComponent', () => {
  let component: StockReverseShipmentAddComponent;
  let fixture: ComponentFixture<StockReverseShipmentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReverseShipmentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReverseShipmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
