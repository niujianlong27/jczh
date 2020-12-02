import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageAboutComponent } from './home-page-about.component';

describe('HomePageAboutComponent', () => {
  let component: HomePageAboutComponent;
  let fixture: ComponentFixture<HomePageAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
