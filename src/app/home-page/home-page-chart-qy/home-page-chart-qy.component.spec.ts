import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageChartQyComponent } from './home-page-chart-qy.component';

describe('HomePageChartQyComponent', () => {
  let component: HomePageChartQyComponent;
  let fixture: ComponentFixture<HomePageChartQyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageChartQyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageChartQyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
