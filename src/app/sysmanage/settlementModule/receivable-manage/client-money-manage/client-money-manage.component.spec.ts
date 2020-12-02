import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMoneyManageComponent } from './client-money-manage.component';

describe('ClientMoneyManageComponent', () => {
  let component: ClientMoneyManageComponent;
  let fixture: ComponentFixture<ClientMoneyManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMoneyManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMoneyManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
