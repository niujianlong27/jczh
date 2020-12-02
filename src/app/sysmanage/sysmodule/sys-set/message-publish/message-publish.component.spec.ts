import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePublishComponent } from './message-publish.component';

describe('MessagePublishComponent', () => {
  let component: MessagePublishComponent;
  let fixture: ComponentFixture<MessagePublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagePublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagePublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
