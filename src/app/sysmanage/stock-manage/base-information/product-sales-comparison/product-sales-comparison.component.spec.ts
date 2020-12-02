import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSalesComparisonComponent } from './product-sales-comparison.component';

describe('ProductSalesComparisonComponent', () => {
  let component: ProductSalesComparisonComponent;
  let fixture: ComponentFixture<ProductSalesComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSalesComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSalesComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
