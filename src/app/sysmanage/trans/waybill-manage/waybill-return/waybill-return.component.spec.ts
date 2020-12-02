import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillReturnComponent } from './waybill-return.component';

describe('WaybillReturnComponent', () => {
  let component: WaybillReturnComponent;
  let fixture: ComponentFixture<WaybillReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
