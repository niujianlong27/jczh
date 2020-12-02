import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutAddComponent } from './stock-out-add.component';

describe('StockOutAddComponent', () => {
  let component: StockOutAddComponent;
  let fixture: ComponentFixture<StockOutAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOutAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOutAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
