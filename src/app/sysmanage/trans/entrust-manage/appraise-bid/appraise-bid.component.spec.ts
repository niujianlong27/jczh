import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraiseBidComponent } from './appraise-bid.component';

describe('AppraiseBidComponent', () => {
  let component: AppraiseBidComponent;
  let fixture: ComponentFixture<AppraiseBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppraiseBidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraiseBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
