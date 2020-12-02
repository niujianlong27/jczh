import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatWaterGaugeComponent } from './boat-water-gauge.component';

describe('BoatWaterGaugeComponent', () => {
  let component: BoatWaterGaugeComponent;
  let fixture: ComponentFixture<BoatWaterGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatWaterGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatWaterGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
