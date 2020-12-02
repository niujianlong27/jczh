import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPlanAddComponent } from './dispatch-plan-add.component';

describe('DispatchPlanAddComponent', () => {
  let component: DispatchPlanAddComponent;
  let fixture: ComponentFixture<DispatchPlanAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchPlanAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchPlanAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
