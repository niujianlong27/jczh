import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageChartQy2Component } from './home-page-chart-qy.component';

describe('HomePageChartQyComponent', () => {
  let component: HomePageChartQy2Component;
  let fixture: ComponentFixture<HomePageChartQy2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageChartQy2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageChartQy2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
