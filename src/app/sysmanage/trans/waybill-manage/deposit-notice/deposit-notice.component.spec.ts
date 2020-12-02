import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositNoticeComponent } from './deposit-notice.component';

describe('DepositNoticeComponent', () => {
  let component: DepositNoticeComponent;
  let fixture: ComponentFixture<DepositNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
