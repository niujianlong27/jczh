import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipWorkComponent } from './ship-work.component';

describe('ShipWorkComponent', () => {
  let component: ShipWorkComponent;
  let fixture: ComponentFixture<ShipWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
