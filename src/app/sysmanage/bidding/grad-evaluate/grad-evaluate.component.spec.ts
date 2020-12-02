import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradEvaluateComponent } from './grad-evaluate.component';

describe('GradEvaluateComponent', () => {
  let component: GradEvaluateComponent;
  let fixture: ComponentFixture<GradEvaluateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradEvaluateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
