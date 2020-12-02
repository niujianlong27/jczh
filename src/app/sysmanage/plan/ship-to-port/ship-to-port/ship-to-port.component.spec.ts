import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipToPortComponent } from './ship-to-port.component';

describe('ShipToPortComponent', () => {
  let component: ShipToPortComponent;
  let fixture: ComponentFixture<ShipToPortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipToPortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipToPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
