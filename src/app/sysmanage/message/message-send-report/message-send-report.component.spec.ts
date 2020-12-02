import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSendReportComponent } from './message-send-report.component';

describe('MessageSendReportComponent', () => {
  let component: MessageSendReportComponent;
  let fixture: ComponentFixture<MessageSendReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSendReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
