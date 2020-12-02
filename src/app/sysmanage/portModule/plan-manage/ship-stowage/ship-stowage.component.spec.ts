import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipStowageComponent } from './ship-stowage.component';

describe('ShipStowageComponent', () => {
  let component: ShipStowageComponent;
  let fixture: ComponentFixture<ShipStowageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipStowageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipStowageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
