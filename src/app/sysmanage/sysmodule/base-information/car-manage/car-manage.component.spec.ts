import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarManageComponent } from './car-manage.component';

describe('CarManageComponent', () => {
  let component: CarManageComponent;
  let fixture: ComponentFixture<CarManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
