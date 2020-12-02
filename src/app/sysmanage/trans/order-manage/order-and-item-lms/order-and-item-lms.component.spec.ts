import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAndItemLMSComponent } from './order-and-item-lms.component';

describe('OrderAndItemLMSComponent', () => {
  let component: OrderAndItemLMSComponent;
  let fixture: ComponentFixture<OrderAndItemLMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAndItemLMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAndItemLMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
