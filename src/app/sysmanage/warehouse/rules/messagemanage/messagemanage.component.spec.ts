import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagemanageComponent } from './messagemanage.component';

describe('MessagemanageComponent', () => {
  let component: MessagemanageComponent;
  let fixture: ComponentFixture<MessagemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
