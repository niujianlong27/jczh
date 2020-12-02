import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillLoadMarkQueryComponent } from './waybill-load-mark-query.component';

describe('WaybillLoadMarkQueryComponent', () => {
  let component: WaybillLoadMarkQueryComponent;
  let fixture: ComponentFixture<WaybillLoadMarkQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillLoadMarkQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillLoadMarkQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
