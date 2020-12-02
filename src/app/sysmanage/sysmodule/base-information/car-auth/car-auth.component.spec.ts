import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAuthComponent } from './car-auth.component';

describe('CarAuthComponent', () => {
  let component: CarAuthComponent;
  let fixture: ComponentFixture<CarAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
