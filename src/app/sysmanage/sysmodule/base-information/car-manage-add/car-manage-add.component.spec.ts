import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarManageAddComponent } from './car-manage-add.component';

describe('CarManageAddComponent', () => {
  let component: CarManageAddComponent;
  let fixture: ComponentFixture<CarManageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarManageAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarManageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
