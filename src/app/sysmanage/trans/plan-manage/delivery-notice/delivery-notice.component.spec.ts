import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryNoticeComponent } from './delivery-notice.component';

describe('DeliveryNoticeComponent', () => {
  let component: DeliveryNoticeComponent;
  let fixture: ComponentFixture<DeliveryNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
