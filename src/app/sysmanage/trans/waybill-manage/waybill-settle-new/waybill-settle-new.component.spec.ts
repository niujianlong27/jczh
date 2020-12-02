import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillSettleNewComponent } from './waybill-settle-new.component';

describe('WaybillSettleNewComponent', () => {
  let component: WaybillSettleNewComponent;
  let fixture: ComponentFixture<WaybillSettleNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillSettleNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillSettleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
