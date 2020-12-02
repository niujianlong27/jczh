import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertruckComponent } from './usertruck.component';

describe('UsertruckComponent', () => {
  let component: UsertruckComponent;
  let fixture: ComponentFixture<UsertruckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsertruckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
