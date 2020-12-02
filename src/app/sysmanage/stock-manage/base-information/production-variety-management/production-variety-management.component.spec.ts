import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionVarietyManagementComponent } from './production-variety-management.component';

describe('ProductionVarietyManagementComponent', () => {
  let component: ProductionVarietyManagementComponent;
  let fixture: ComponentFixture<ProductionVarietyManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionVarietyManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionVarietyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
