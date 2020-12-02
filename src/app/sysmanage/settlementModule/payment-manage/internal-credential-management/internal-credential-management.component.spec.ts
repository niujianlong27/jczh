import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalCredentialManagementComponent } from './internal-credential-management.component';

describe('InternalCredentialManagementComponent', () => {
  let component: InternalCredentialManagementComponent;
  let fixture: ComponentFixture<InternalCredentialManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalCredentialManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalCredentialManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
