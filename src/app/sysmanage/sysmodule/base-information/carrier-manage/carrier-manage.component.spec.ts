import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierManageComponent } from './carrier-manage.component';

describe('CarrierManageComponent', () => {
  let component: CarrierManageComponent;
  let fixture: ComponentFixture<CarrierManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
