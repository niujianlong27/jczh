import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutRuleMaintenanceComponent } from './timeout-rule-maintenance.component';

describe('TimeoutRuleMaintenanceComponent', () => {
  let component: TimeoutRuleMaintenanceComponent;
  let fixture: ComponentFixture<TimeoutRuleMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeoutRuleMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoutRuleMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
