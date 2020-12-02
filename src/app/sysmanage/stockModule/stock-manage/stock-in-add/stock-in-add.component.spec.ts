import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInAddComponent } from './stock-in-add.component';

describe('StockInAddComponent', () => {
  let component: StockInAddComponent;
  let fixture: ComponentFixture<StockInAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
