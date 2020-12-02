import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillDelTwoComponent } from './waybill-del-two.component';

describe('WaybillDelTwoComponent', () => {
  let component: WaybillDelTwoComponent;
  let fixture: ComponentFixture<WaybillDelTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillDelTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillDelTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
