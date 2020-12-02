import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThroughputGoodsStatisticsComponent } from './throughput-goods-statistics.component';

describe('ThroughputGoodsStatisticsComponent', () => {
  let component: ThroughputGoodsStatisticsComponent;
  let fixture: ComponentFixture<ThroughputGoodsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThroughputGoodsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThroughputGoodsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
