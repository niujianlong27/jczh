import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipConfirmComponent } from './ship-confirm.component';

describe('ShipConfirmComponent', () => {
  let component: ShipConfirmComponent;
  let fixture: ComponentFixture<ShipConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
