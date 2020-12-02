import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillSettlementComponent } from './waybill-settlement.component';

describe('WaybillSettlementComponent', () => {
  let component: WaybillSettlementComponent;
  let fixture: ComponentFixture<WaybillSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
