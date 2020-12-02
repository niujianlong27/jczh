import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentBigScreenComponent } from './appointment-big-screen.component';

describe('AppointmentBigScreenComponent', () => {
  let component: AppointmentBigScreenComponent;
  let fixture: ComponentFixture<AppointmentBigScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentBigScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentBigScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
