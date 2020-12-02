import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleShortageComponent } from './vehicle-shortage.component';

describe('VehicleShortageComponent', () => {
  let component: VehicleShortageComponent;
  let fixture: ComponentFixture<VehicleShortageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleShortageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
