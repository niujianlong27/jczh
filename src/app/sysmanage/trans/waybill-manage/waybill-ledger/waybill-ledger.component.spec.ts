import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillLedgerComponent } from './waybill-ledger.component';

describe('WaybillLedgerComponent', () => {
  let component: WaybillLedgerComponent;
  let fixture: ComponentFixture<WaybillLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
