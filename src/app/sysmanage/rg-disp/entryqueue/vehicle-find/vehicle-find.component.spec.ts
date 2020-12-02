import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFindComponent } from './vehicle-find.component';

describe('VehicleFindComponent', () => {
  let component: VehicleFindComponent;
  let fixture: ComponentFixture<VehicleFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
