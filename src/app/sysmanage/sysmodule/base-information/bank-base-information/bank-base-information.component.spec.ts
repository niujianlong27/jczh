import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBaseInformationComponent } from './bank-base-information.component';

describe('BankBaseInformationComponent', () => {
  let component: BankBaseInformationComponent;
  let fixture: ComponentFixture<BankBaseInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankBaseInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankBaseInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
