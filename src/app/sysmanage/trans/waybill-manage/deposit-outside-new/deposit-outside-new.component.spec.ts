import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositOutsideNewComponent } from './deposit-outside-new.component';

describe('DepositOutsideNewComponent', () => {
  let component: DepositOutsideNewComponent;
  let fixture: ComponentFixture<DepositOutsideNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositOutsideNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositOutsideNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
