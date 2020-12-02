import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueSchedulingComponent } from './queue-scheduling.component';

describe('QueueSchedulingComponent', () => {
  let component: QueueSchedulingComponent;
  let fixture: ComponentFixture<QueueSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
