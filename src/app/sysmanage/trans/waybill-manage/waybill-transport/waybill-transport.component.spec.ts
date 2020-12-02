import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillTransportComponent } from './waybill-transport.component';

describe('WaybillTransportComponent', () => {
  let component: WaybillTransportComponent;
  let fixture: ComponentFixture<WaybillTransportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillTransportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
