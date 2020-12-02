import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkTimeoutComponent } from './matkind.component';

describe('ParkTimeoutComponent', () => {
  let component: ParkTimeoutComponent;
  let fixture: ComponentFixture<ParkTimeoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkTimeoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkTimeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
