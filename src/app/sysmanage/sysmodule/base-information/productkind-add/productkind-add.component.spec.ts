import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductkindAddComponent } from './productkind-add.component';

describe('ProductkindAddComponent', () => {
  let component: ProductkindAddComponent;
  let fixture: ComponentFixture<ProductkindAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductkindAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductkindAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
