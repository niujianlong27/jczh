import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOldPlanComponent } from './add-old-plan.component';

describe('AddOldPlanComponent', () => {
  let component: AddOldPlanComponent;
  let fixture: ComponentFixture<AddOldPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOldPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOldPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
