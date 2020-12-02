import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetRatioManageComponent } from './fleet-ratio-manage.component';

describe('FleetRatioManageComponent', () => {
  let component: FleetRatioManageComponent;
  let fixture: ComponentFixture<FleetRatioManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetRatioManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetRatioManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
