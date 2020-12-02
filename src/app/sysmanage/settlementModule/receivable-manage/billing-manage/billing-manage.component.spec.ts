import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingManageComponent } from './billing-manage.component';

describe('BillingManageComponent', () => {
  let component: BillingManageComponent;
  let fixture: ComponentFixture<BillingManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
