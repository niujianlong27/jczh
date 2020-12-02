import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDispatchComponent } from './order-dispatch.component';

describe('OrderDispatchComponent', () => {
  let component: OrderDispatchComponent;
  let fixture: ComponentFixture<OrderDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
