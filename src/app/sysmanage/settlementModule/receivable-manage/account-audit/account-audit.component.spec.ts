import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAuditComponent } from './account-audit.component';

describe('AccountAuditComponent', () => {
  let component: AccountAuditComponent;
  let fixture: ComponentFixture<AccountAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
