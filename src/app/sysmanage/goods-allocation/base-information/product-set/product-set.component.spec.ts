import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSetComponent } from './product-set.component';

describe('ProductSetComponent', () => {
  let component: ProductSetComponent;
  let fixture: ComponentFixture<ProductSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
