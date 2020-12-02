import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSettlementComponent } from './sale-settlement.component';

describe('SaleSettlementComponent', () => {
  let component: SaleSettlementComponent;
  let fixture: ComponentFixture<SaleSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
