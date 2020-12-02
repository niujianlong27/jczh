import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionNewComponent } from './role-permission-new.component';

describe('RolePermissionNewComponent', () => {
  let component: RolePermissionNewComponent;
  let fixture: ComponentFixture<RolePermissionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePermissionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePermissionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
