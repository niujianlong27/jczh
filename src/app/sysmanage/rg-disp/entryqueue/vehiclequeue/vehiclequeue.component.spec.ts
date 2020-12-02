import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclequeueComponent } from './vehiclequeue.component';

describe('VehiclequeueComponent', () => {
  let component: VehiclequeueComponent;
  let fixture: ComponentFixture<VehiclequeueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclequeueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclequeueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
