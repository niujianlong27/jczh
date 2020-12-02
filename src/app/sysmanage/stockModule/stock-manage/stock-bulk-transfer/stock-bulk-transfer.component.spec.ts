import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkTransferComponent } from './stock-bulk-transfer.component';

describe('StockBulkTransferComponent', () => {
  let component: StockBulkTransferComponent;
  let fixture: ComponentFixture<StockBulkTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
