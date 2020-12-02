import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMoveAddComponent } from './stock-move-add.component';

describe('StockMoveAddComponent', () => {
  let component: StockMoveAddComponent;
  let fixture: ComponentFixture<StockMoveAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockMoveAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMoveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
