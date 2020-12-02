import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarierManageAddComponent } from './carier-manage-add.component';

describe('CarierManageAddComponent', () => {
  let component: CarierManageAddComponent;
  let fixture: ComponentFixture<CarierManageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarierManageAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarierManageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
