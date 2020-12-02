import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBulkMoveComponent } from './stock-bulk-move.component';

describe('StockBulkMoveComponent', () => {
  let component: StockBulkMoveComponent;
  let fixture: ComponentFixture<StockBulkMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBulkMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBulkMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
