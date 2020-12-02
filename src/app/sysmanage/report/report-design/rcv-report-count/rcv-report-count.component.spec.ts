import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcvReportCountComponent } from './rcv-report-count.component';

describe('RcvReportCountComponent', () => {
  let component: RcvReportCountComponent;
  let fixture: ComponentFixture<RcvReportCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcvReportCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcvReportCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
