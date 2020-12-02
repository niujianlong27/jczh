import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillReconciliationComponent } from './waybill-reconciliation.component';

describe('WaybillReconciliationComponent', () => {
  let component: WaybillReconciliationComponent;
  let fixture: ComponentFixture<WaybillReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
