import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositOrderManageOutComponent } from './deposit-order-manage-out.component';

describe('DepositOrderManageOutComponent', () => {
  let component: DepositOrderManageOutComponent;
  let fixture: ComponentFixture<DepositOrderManageOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositOrderManageOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositOrderManageOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
