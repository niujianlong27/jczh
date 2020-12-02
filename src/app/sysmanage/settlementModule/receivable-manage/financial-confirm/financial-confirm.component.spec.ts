import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialConfirmComponent } from './financial-confirm.component';

describe('FinancialConfirmComponent', () => {
  let component: FinancialConfirmComponent;
  let fixture: ComponentFixture<FinancialConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
