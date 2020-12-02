import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkInventoryAddComponent } from './stock-bulk-inventory-add.component';

describe('StockBulkInventoryAddComponent', () => {
  let component: StockBulkInventoryAddComponent;
  let fixture: ComponentFixture<StockBulkInventoryAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkInventoryAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkInventoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
