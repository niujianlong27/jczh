import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeRegInquNewComponent } from './fee-reg-inqu-new.component';

describe('FeeRegInquNewComponent', () => {
  let component: FeeRegInquNewComponent;
  let fixture: ComponentFixture<FeeRegInquNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeRegInquNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeRegInquNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
