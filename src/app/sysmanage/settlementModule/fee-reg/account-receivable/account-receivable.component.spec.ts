import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivableComponent } from './account-receivable.component';

describe('AccountReceivableComponent', () => {
  let component: AccountReceivableComponent;
  let fixture: ComponentFixture<AccountReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
