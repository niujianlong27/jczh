import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRegisterFormComponent } from './home-register-form.component';

describe('HomeRegisterFormComponent', () => {
  let component: HomeRegisterFormComponent;
  let fixture: ComponentFixture<HomeRegisterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRegisterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
