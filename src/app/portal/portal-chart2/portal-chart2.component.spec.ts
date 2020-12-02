import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalChart2Component } from './portal-chart2.component';

describe('PortalChart2Component', () => {
  let component: PortalChart2Component;
  let fixture: ComponentFixture<PortalChart2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalChart2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalChart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
