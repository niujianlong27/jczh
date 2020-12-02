import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRemindComponent } from './message-remind.component';

describe('MessageRemindComponent', () => {
  let component: MessageRemindComponent;
  let fixture: ComponentFixture<MessageRemindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageRemindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageRemindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
