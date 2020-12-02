import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipAllocateComponent } from './ship-allocate.component';

describe('ShipAllocateComponent', () => {
  let component: ShipAllocateComponent;
  let fixture: ComponentFixture<ShipAllocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipAllocateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipAllocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
