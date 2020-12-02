import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferAddComponent } from './stock-transfer-add.component';

describe('StockTransferAddComponent', () => {
  let component: StockTransferAddComponent;
  let fixture: ComponentFixture<StockTransferAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransferAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
