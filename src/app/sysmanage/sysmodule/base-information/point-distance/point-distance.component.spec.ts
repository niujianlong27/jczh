import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointDistanceComponent } from './point-distance.component';

describe('PointDistanceComponent', () => {
  let component: PointDistanceComponent;
  let fixture: ComponentFixture<PointDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
