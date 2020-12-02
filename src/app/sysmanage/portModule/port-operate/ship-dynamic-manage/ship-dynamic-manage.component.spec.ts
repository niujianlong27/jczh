import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipDynamicManageComponent } from './ship-dynamic-manage.component';

describe('ShipDynamicManageComponent', () => {
  let component: ShipDynamicManageComponent;
  let fixture: ComponentFixture<ShipDynamicManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipDynamicManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipDynamicManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
