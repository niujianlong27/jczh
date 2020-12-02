import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserloginStatisticsComponent } from './userlogin-statistics.component';

describe('UserloginStatisticsComponent', () => {
  let component: UserloginStatisticsComponent;
  let fixture: ComponentFixture<UserloginStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserloginStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserloginStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
