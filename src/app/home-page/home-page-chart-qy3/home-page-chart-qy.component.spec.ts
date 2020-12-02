import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageChartQy3Component } from './home-page-chart-qy.component';

describe('HomePageChartQy3Component', () => {
  let component: HomePageChartQy3Component;
  let fixture: ComponentFixture<HomePageChartQy3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageChartQy3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageChartQy3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
