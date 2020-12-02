import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShStockFlatAccountComponent } from './sh-stock-flat-account.component';

describe('ShStockFlatAccountComponent', () => {
  let component: ShStockFlatAccountComponent;
  let fixture: ComponentFixture<ShStockFlatAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShStockFlatAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShStockFlatAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
