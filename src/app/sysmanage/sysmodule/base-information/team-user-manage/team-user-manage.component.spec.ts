import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamUserManageComponent } from './team-user-manage.component';

describe('TeamUserManageComponent', () => {
  let component: TeamUserManageComponent;
  let fixture: ComponentFixture<TeamUserManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamUserManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamUserManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
