import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkOutAddComponent } from './stock-bulk-out-add.component';

describe('StockBulkOutAddComponent', () => {
  let component: StockBulkOutAddComponent;
  let fixture: ComponentFixture<StockBulkOutAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkOutAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkOutAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
