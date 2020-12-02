import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionColComponent } from './role-permission-col.component';

describe('RolePermissionColComponent', () => {
  let component: RolePermissionColComponent;
  let fixture: ComponentFixture<RolePermissionColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePermissionColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePermissionColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
