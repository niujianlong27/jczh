import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPermissionAddComponent } from './company-permission-add.component';

describe('CompanyPermissionAddComponent', () => {
  let component: CompanyPermissionAddComponent;
  let fixture: ComponentFixture<CompanyPermissionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPermissionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPermissionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
