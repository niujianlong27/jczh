import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterElectricityComponent } from './water-electricity.component';

describe('WaterElectricityComponent', () => {
  let component: WaterElectricityComponent;
  let fixture: ComponentFixture<WaterElectricityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterElectricityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterElectricityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
