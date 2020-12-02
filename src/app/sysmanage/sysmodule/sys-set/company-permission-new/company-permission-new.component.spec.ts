import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPermissionNewComponent } from './company-permission-new.component';

describe('CompanyPermissionNewComponent', () => {
  let component: CompanyPermissionNewComponent;
  let fixture: ComponentFixture<CompanyPermissionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPermissionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPermissionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
