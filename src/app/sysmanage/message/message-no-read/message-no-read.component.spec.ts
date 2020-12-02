import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageNoReadComponent } from './message-no-read.component';

describe('MessageNoReadComponent', () => {
  let component: MessageNoReadComponent;
  let fixture: ComponentFixture<MessageNoReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageNoReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageNoReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
