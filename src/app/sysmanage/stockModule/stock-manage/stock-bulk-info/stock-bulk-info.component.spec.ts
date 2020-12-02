import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkInfoComponent } from './stock-bulk-info.component';

describe('StockBulkInfoComponent', () => {
  let component: StockBulkInfoComponent;
  let fixture: ComponentFixture<StockBulkInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
