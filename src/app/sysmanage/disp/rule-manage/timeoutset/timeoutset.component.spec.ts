import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutsetComponent } from './timeoutset.component';

describe('TimeoutsetComponent', () => {
  let component: TimeoutsetComponent;
  let fixture: ComponentFixture<TimeoutsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeoutsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoutsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
