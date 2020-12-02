import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinEfficiencyMaintainComponent } from './cabin-efficiency-maintain.component';

describe('CabinEfficiencyMaintainComponent', () => {
  let component: CabinEfficiencyMaintainComponent;
  let fixture: ComponentFixture<CabinEfficiencyMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabinEfficiencyMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinEfficiencyMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
