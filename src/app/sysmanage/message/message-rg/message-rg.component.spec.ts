import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRgComponent } from './message-rg.component';

describe('MessageRgComponent', () => {
  let component: MessageRgComponent;
  let fixture: ComponentFixture<MessageRgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageRgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageRgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
