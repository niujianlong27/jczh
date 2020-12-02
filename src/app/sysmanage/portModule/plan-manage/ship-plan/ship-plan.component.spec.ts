import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipPlanComponent } from './ship-plan.component';

describe('ShipPlanComponent', () => {
  let component: ShipPlanComponent;
  let fixture: ComponentFixture<ShipPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
