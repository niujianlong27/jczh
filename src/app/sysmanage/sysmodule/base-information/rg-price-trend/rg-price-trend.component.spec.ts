import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RGPriceTrendComponent } from './rg-price-trend.component';

describe('RGPriceTrendComponent', () => {
  let component: RGPriceTrendComponent;
  let fixture: ComponentFixture<RGPriceTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RGPriceTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RGPriceTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
