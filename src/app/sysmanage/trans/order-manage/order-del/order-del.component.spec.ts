import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDelComponent } from './order-del.component';

describe('OrderDelComponent', () => {
  let component: OrderDelComponent;
  let fixture: ComponentFixture<OrderDelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
