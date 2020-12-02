import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceReportComponent } from './trace-report.component';

describe('TraceReportComponent', () => {
  let component: TraceReportComponent;
  let fixture: ComponentFixture<TraceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
