import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBankDataComponent } from './company-bank-data.component';

describe('CompanyBankDataComponent', () => {
  let component: CompanyBankDataComponent;
  let fixture: ComponentFixture<CompanyBankDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBankDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBankDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
