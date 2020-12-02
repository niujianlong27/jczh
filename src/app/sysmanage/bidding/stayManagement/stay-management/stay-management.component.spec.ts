import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StayManagementComponent } from './stay-management.component';

describe('StayManagementComponent', () => {
  let component: StayManagementComponent;
  let fixture: ComponentFixture<StayManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
