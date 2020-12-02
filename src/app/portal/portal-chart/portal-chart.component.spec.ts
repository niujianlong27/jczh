import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalChartComponent } from './portal-chart.component'

describe('PortalChartComponent', () => {
  let component: PortalChartComponent;
  let fixture: ComponentFixture<PortalChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
