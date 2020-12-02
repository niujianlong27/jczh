import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkOutComponent } from './stock-bulk-out.component';

describe('StockBulkOutComponent', () => {
  let component: StockBulkOutComponent;
  let fixture: ComponentFixture<StockBulkOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
