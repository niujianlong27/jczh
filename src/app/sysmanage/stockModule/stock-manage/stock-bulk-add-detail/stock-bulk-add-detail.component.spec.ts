import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkAddDetailComponent } from './stock-bulk-add-detail.component';

describe('StockBulkAddDetailComponent', () => {
  let component: StockBulkAddDetailComponent;
  let fixture: ComponentFixture<StockBulkAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
