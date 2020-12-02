import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkMoveAddComponent } from './stock-bulk-move-add.component';

describe('StockBulkMoveAddComponent', () => {
  let component: StockBulkMoveAddComponent;
  let fixture: ComponentFixture<StockBulkMoveAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkMoveAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkMoveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
