import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesShipsComponent } from './vehicles-ships.component';

describe('VehiclesShipsComponent', () => {
  let component: VehiclesShipsComponent;
  let fixture: ComponentFixture<VehiclesShipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclesShipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesShipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
