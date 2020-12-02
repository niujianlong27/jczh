import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSendRGSalesComponent } from './message-send-rgsales.component';

describe('MessageSendRGSalesComponent', () => {
  let component: MessageSendRGSalesComponent;
  let fixture: ComponentFixture<MessageSendRGSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSendRGSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSendRGSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
