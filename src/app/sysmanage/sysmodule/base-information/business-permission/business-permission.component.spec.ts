import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPermissionComponent } from './business-permission.component';

describe('BusinessPermissionComponent', () => {
  let component: BusinessPermissionComponent;
  let fixture: ComponentFixture<BusinessPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
