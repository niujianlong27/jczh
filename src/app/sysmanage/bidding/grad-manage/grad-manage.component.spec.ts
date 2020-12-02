import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradManageComponent } from './grad-manage.component';

describe('GradManageComponent', () => {
  let component: GradManageComponent;
  let fixture: ComponentFixture<GradManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
