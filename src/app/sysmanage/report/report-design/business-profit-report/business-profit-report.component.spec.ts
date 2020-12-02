import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProfitReportComponent } from './business-profit-report.component';

describe('BusinessProfitReportComponent', () => {
  let component: BusinessProfitReportComponent;
  let fixture: ComponentFixture<BusinessProfitReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessProfitReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProfitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
