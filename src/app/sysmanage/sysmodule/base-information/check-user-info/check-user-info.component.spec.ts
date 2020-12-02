import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUserInfoComponent } from './check-user-info.component';

describe('CheckUserInfoComponent', () => {
  let component: CheckUserInfoComponent;
  let fixture: ComponentFixture<CheckUserInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUserInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
