import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicBankInformationComponent } from './basic-bank-information.component';

describe('BasicBankInformationComponent', () => {
  let component: BasicBankInformationComponent;
  let fixture: ComponentFixture<BasicBankInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicBankInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicBankInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
