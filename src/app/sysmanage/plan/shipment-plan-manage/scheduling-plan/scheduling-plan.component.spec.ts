import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingPlanComponent } from './scheduling-plan.component';

describe('SchedulingPlanComponent', () => {
  let component: SchedulingPlanComponent;
  let fixture: ComponentFixture<SchedulingPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
