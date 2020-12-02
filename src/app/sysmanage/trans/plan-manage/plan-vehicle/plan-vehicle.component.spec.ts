import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanVehicleComponent } from './plan-vehicle.component';

describe('PlanVehicleComponent', () => {
  let component: PlanVehicleComponent;
  let fixture: ComponentFixture<PlanVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
