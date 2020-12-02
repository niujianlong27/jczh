import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrustScheduleComponent } from './entrust-schedule.component';

describe('EntrustScheduleComponent', () => {
  let component: EntrustScheduleComponent;
  let fixture: ComponentFixture<EntrustScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrustScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrustScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
