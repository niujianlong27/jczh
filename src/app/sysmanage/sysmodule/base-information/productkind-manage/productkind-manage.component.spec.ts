import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductkindManageComponent } from './productkind-manage.component';

describe('ProductkindManageComponent', () => {
  let component: ProductkindManageComponent;
  let fixture: ComponentFixture<ProductkindManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductkindManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductkindManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
