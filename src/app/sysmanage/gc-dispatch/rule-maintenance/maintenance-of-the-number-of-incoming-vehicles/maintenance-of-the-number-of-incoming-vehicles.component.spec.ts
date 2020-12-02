import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceOfTheNumberOfIncomingVehiclesComponent } from './maintenance-of-the-number-of-incoming-vehicles.component';

describe('MaintenanceOfTheNumberOfIncomingVehiclesComponent', () => {
  let component: MaintenanceOfTheNumberOfIncomingVehiclesComponent;
  let fixture: ComponentFixture<MaintenanceOfTheNumberOfIncomingVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceOfTheNumberOfIncomingVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceOfTheNumberOfIncomingVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
