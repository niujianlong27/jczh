import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLocationSetComponent } from './stock-location-set.component';

describe('StockLocationSetComponent', () => {
  let component: StockLocationSetComponent;
  let fixture: ComponentFixture<StockLocationSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockLocationSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockLocationSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
