import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillFeeRegComponent } from './waybill-fee-reg.component';

describe('WaybillFeeRegComponent', () => {
  let component: WaybillFeeRegComponent;
  let fixture: ComponentFixture<WaybillFeeRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillFeeRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillFeeRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
