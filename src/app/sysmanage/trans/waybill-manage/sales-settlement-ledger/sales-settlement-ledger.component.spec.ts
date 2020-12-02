import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSettlementLedgerComponent } from './sales-settlement-ledger.component';

describe('SalesSettlementLedgerComponent', () => {
  let component: SalesSettlementLedgerComponent;
  let fixture: ComponentFixture<SalesSettlementLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesSettlementLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesSettlementLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
