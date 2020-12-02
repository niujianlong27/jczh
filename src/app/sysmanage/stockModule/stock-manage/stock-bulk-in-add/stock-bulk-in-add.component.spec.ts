import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkInAddComponent } from './stock-bulk-in-add.component';

describe('StockBulkInAddComponent', () => {
  let component: StockBulkInAddComponent;
  let fixture: ComponentFixture<StockBulkInAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkInAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkInAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
