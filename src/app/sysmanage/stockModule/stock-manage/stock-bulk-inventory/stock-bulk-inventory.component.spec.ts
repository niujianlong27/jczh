import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkInventoryComponent } from './stock-bulk-inventory.component';

describe('StockBulkInventoryComponent', () => {
  let component: StockBulkInventoryComponent;
  let fixture: ComponentFixture<StockBulkInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
