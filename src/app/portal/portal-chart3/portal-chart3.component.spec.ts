import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalChart3Component } from './portal-chart3.component';

describe('PortalChart3Component', () => {
  let component: PortalChart3Component;
  let fixture: ComponentFixture<PortalChart3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalChart3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalChart3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
