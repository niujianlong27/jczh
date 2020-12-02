import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesVarietyManagementComponent } from './sales-variety-management.component';

describe('SalesVarietyManagementComponent', () => {
  let component: SalesVarietyManagementComponent;
  let fixture: ComponentFixture<SalesVarietyManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesVarietyManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesVarietyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
