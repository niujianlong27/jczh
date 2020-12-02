import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPlanComponent } from './job-plan.component';

describe('JobPlanComponent', () => {
  let component: JobPlanComponent;
  let fixture: ComponentFixture<JobPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
