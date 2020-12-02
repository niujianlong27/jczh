import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageCultureComponent } from './home-page-culture.component';

describe('HomePageCultureComponent', () => {
  let component: HomePageCultureComponent;
  let fixture: ComponentFixture<HomePageCultureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageCultureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
