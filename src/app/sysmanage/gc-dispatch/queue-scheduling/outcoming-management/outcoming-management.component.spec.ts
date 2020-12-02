import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomingManagementComponent } from './outcoming-management.component';

describe('OutcomingManagementComponent', () => {
  let component: OutcomingManagementComponent;
  let fixture: ComponentFixture<OutcomingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutcomingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutcomingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
