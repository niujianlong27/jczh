import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInfoCdgcComponent } from './schedule-info-cdgc.component';

describe('ScheduleInfoCdgcComponent', () => {
  let component: ScheduleInfoCdgcComponent;
  let fixture: ComponentFixture<ScheduleInfoCdgcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleInfoCdgcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleInfoCdgcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
