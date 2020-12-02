import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSendRGSalesAllMessageComponent } from './message-send-rgsales-all-message.component';

describe('MessageSendRGSalesAllMessageComponent', () => {
  let component: MessageSendRGSalesAllMessageComponent;
  let fixture: ComponentFixture<MessageSendRGSalesAllMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSendRGSalesAllMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSendRGSalesAllMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
