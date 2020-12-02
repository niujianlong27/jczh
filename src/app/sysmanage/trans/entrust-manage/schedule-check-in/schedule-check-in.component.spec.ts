import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCheckInComponent } from './schedule-check-in.component';

describe('ScheduleCheckInComponent', () => {
  let component: ScheduleCheckInComponent;
  let fixture: ComponentFixture<ScheduleCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
