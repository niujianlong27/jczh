import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageCarsComponent } from './home-page-cars.component';

describe('HomePageCarsComponent', () => {
  let component: HomePageCarsComponent;
  let fixture: ComponentFixture<HomePageCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
