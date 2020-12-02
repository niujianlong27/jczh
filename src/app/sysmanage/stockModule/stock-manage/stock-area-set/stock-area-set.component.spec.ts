import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAreaSetComponent } from './stock-area-set.component';

describe('StockAreaSetComponent', () => {
  let component: StockAreaSetComponent;
  let fixture: ComponentFixture<StockAreaSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAreaSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAreaSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
