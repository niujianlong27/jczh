import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatisticsComponent } from './order-statistics.component';

describe('OrderStatisticsComponent', () => {
  let component: OrderStatisticsComponent;
  let fixture: ComponentFixture<OrderStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
