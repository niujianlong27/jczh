import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatInspectGaugeComponent } from './boat-inspect-gauge.component';

describe('BoatInspectGaugeComponent', () => {
  let component: BoatInspectGaugeComponent;
  let fixture: ComponentFixture<BoatInspectGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatInspectGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatInspectGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
