import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductareaManageComponent } from './productarea-manage.component';

describe('ProductareaManageComponent', () => {
  let component: ProductareaManageComponent;
  let fixture: ComponentFixture<ProductareaManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductareaManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductareaManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
