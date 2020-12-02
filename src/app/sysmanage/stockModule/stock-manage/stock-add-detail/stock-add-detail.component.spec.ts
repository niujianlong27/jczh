import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAddDetailComponent } from './stock-add-detail.component';

describe('StockAddDetailComponent', () => {
  let component: StockAddDetailComponent;
  let fixture: ComponentFixture<StockAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
