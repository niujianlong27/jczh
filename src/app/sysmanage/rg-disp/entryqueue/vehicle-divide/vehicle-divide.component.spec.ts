import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDivideComponent } from './vehicle-divide.component';

describe('VehicleDivideComponent', () => {
  let component: VehicleDivideComponent;
  let fixture: ComponentFixture<VehicleDivideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDivideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDivideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
