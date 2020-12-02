import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatDataStatisticsComponent } from './boat-data-statistics.component';

describe('BoatDataStatisticsComponent', () => {
  let component: BoatDataStatisticsComponent;
  let fixture: ComponentFixture<BoatDataStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatDataStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatDataStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
