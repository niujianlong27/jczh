import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipBerthingDeparturePlanComponent } from './ship-berthing-departure-plan.component';

describe('ShipBerthingDeparturePlanComponent', () => {
  let component: ShipBerthingDeparturePlanComponent;
  let fixture: ComponentFixture<ShipBerthingDeparturePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipBerthingDeparturePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipBerthingDeparturePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
