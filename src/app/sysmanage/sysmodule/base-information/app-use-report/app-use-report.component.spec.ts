import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUseReportComponent } from './app-use-report.component';

describe('AppUseReportComponent', () => {
  let component: AppUseReportComponent;
  let fixture: ComponentFixture<AppUseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
