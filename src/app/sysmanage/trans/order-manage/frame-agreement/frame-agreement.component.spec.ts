import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameAgreementComponent } from './frame-agreement.component';

describe('FrameAgreementComponent', () => {
  let component: FrameAgreementComponent;
  let fixture: ComponentFixture<FrameAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
