import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportInquiryComponent } from './transport-inquiry.component';

describe('TransportInquiryComponent', () => {
  let component: TransportInquiryComponent;
  let fixture: ComponentFixture<TransportInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
