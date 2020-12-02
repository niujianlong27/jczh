import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipCollect2Component } from './ship-collect2.component';

describe('ShipCollect2Component', () => {
  let component: ShipCollect2Component;
  let fixture: ComponentFixture<ShipCollect2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipCollect2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipCollect2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
