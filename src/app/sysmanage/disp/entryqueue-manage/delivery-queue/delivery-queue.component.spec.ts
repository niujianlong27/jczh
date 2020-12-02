import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryQueueComponent } from './delivery-queue.component';

describe('DeliveryQueueComponent', () => {
  let component: DeliveryQueueComponent;
  let fixture: ComponentFixture<DeliveryQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
