import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkTranferAddComponent } from './stock-bulk-tranfer-add.component';

describe('StockBulkTranferAddComponent', () => {
  let component: StockBulkTranferAddComponent;
  let fixture: ComponentFixture<StockBulkTranferAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkTranferAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkTranferAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
