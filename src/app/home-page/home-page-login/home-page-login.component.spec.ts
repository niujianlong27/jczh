import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageLoginComponent } from './home-page-login.component';

describe('HomePageLoginComponent', () => {
  let component: HomePageLoginComponent;
  let fixture: ComponentFixture<HomePageLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
