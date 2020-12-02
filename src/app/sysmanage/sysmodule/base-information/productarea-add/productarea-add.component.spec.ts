import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductareaAddComponent } from './productarea-add.component';

describe('ProductareaAddComponent', () => {
  let component: ProductareaAddComponent;
  let fixture: ComponentFixture<ProductareaAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductareaAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductareaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
