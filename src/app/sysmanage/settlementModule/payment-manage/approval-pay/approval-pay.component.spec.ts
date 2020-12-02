import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPayComponent } from './approval-pay.component';

describe('ApprovalPayComponent', () => {
  let component: ApprovalPayComponent;
  let fixture: ComponentFixture<ApprovalPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
