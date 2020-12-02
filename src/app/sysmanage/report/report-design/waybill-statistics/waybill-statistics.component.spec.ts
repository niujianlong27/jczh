import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillStatisticsComponent } from './waybill-statistics.component';

describe('WaybillStatisticsComponent', () => {
  let component: WaybillStatisticsComponent;
  let fixture: ComponentFixture<WaybillStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
