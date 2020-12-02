import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundOrderQueryComponent } from './outbound-order-query.component';

describe('OutboundOrderQueryComponent', () => {
  let component: OutboundOrderQueryComponent;
  let fixture: ComponentFixture<OutboundOrderQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundOrderQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundOrderQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
