import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingManagementComponent } from './incoming-management.component';

describe('IncomingManagementComponent', () => {
  let component: IncomingManagementComponent;
  let fixture: ComponentFixture<IncomingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
