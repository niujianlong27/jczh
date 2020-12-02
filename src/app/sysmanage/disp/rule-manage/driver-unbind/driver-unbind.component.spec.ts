import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverUnbindComponent } from './driver-unbind.component';

describe('DriverUnbindComponent', () => {
  let component: DriverUnbindComponent;
  let fixture: ComponentFixture<DriverUnbindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverUnbindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverUnbindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
