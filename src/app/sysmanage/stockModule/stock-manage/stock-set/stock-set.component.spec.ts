import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSetComponent } from './stock-set.component';

describe('StockSetComponent', () => {
  let component: StockSetComponent;
  let fixture: ComponentFixture<StockSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
