import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableReportCountComponent } from './payable-report-count.component';

describe('PayableReportCountComponent', () => {
  let component: PayableReportCountComponent;
  let fixture: ComponentFixture<PayableReportCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayableReportCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableReportCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
