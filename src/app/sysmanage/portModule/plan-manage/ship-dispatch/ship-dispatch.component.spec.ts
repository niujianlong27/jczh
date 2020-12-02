import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipDispatchComponent } from './ship-dispatch.component';

describe('ShipDispatchComponent', () => {
  let component: ShipDispatchComponent;
  let fixture: ComponentFixture<ShipDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
