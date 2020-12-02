import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipDemandComponent } from './ship-demand.component';

describe('ShipDemandComponent', () => {
  let component: ShipDemandComponent;
  let fixture: ComponentFixture<ShipDemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipDemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
