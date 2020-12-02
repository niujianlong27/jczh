import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPlanComponent } from './dispatch-plan.component';

describe('DispatchPlanComponent', () => {
  let component: DispatchPlanComponent;
  let fixture: ComponentFixture<DispatchPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
