import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLogReportComponent } from './login-log-report.component';

describe('LoginLogReportComponent', () => {
  let component: LoginLogReportComponent;
  let fixture: ComponentFixture<LoginLogReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginLogReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
