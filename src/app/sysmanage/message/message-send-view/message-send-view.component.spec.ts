import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSendViewComponent } from './message-send-view.component';

describe('MessageSendViewComponent', () => {
  let component: MessageSendViewComponent;
  let fixture: ComponentFixture<MessageSendViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSendViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSendViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
