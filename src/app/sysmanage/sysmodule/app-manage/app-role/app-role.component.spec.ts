import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRoleComponent } from './app-role.component';

describe('AppRoleComponent', () => {
  let component: AppRoleComponent;
  let fixture: ComponentFixture<AppRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
