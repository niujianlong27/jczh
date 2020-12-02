import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclequeueFgComponent } from './vehiclequeue-fg.component';

describe('VehiclequeueFgComponent', () => {
  let component: VehiclequeueFgComponent;
  let fixture: ComponentFixture<VehiclequeueFgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclequeueFgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclequeueFgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
