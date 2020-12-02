import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInventoryAddComponent } from './stock-inventory-add.component';

describe('StockInventoryAddComponent', () => {
  let component: StockInventoryAddComponent;
  let fixture: ComponentFixture<StockInventoryAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInventoryAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInventoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
