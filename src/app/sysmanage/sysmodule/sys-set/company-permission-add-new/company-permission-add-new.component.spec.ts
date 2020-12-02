import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPermissionAddNewComponent } from './company-permission-add-new.component';

describe('CompanyPermissionAddNewComponent', () => {
  let component: CompanyPermissionAddNewComponent;
  let fixture: ComponentFixture<CompanyPermissionAddNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPermissionAddNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPermissionAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
