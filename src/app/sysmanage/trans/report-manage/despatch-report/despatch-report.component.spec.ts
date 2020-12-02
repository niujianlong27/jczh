import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DespatchReportComponent } from './despatch-report.component';

describe('DespatchReportComponent', () => {
  let component: DespatchReportComponent;
  let fixture: ComponentFixture<DespatchReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DespatchReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DespatchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
