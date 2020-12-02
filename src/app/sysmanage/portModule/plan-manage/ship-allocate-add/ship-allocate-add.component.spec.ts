import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipAllocateAddComponent } from './ship-allocate-add.component';

describe('ShipAllocateAddComponent', () => {
  let component: ShipAllocateAddComponent;
  let fixture: ComponentFixture<ShipAllocateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipAllocateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipAllocateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
