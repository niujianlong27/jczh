import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillCheckReconciliationComponent } from './waybill-check-reconciliation.component';

describe('WaybillCheckReconciliationComponent', () => {
  let component: WaybillCheckReconciliationComponent;
  let fixture: ComponentFixture<WaybillCheckReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillCheckReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillCheckReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
