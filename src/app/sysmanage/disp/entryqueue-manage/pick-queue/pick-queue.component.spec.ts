import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickQueueComponent } from './pick-queue.component';

describe('PickQueueComponent', () => {
  let component: PickQueueComponent;
  let fixture: ComponentFixture<PickQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
