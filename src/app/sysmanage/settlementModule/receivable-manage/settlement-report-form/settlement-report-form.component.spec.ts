import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementReportFormComponent } from './settlement-report-form.component';

describe('SettlementReportFormComponent', () => {
  let component: SettlementReportFormComponent;
  let fixture: ComponentFixture<SettlementReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
