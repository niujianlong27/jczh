import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockFlatAccountComponent } from './stock-flat-account.component';

describe('StockFlatAccountComponent', () => {
  let component: StockFlatAccountComponent;
  let fixture: ComponentFixture<StockFlatAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockFlatAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockFlatAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
