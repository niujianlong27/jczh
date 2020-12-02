import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkInComponent } from './stock-bulk-in.component';

describe('StockBulkInComponent', () => {
  let component: StockBulkInComponent;
  let fixture: ComponentFixture<StockBulkInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
