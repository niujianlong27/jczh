import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPermissionComponent } from './company-permission.component';

describe('CompanyPermissionComponent', () => {
  let component: CompanyPermissionComponent;
  let fixture: ComponentFixture<CompanyPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
