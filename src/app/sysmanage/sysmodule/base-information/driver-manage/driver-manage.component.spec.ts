import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverManageComponent } from './driver-manage.component';

describe('DriverManageComponent', () => {
  let component: DriverManageComponent;
  let fixture: ComponentFixture<DriverManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
