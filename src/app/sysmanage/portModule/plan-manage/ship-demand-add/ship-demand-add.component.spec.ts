import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipDemandAddComponent } from './ship-demand-add.component';

describe('ShipDemandAddComponent', () => {
  let component: ShipDemandAddComponent;
  let fixture: ComponentFixture<ShipDemandAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipDemandAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipDemandAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
