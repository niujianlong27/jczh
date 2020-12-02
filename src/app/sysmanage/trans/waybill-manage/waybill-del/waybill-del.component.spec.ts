import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillDelComponent } from './waybill-del.component';

describe('WaybillDelComponent', () => {
  let component: WaybillDelComponent;
  let fixture: ComponentFixture<WaybillDelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillDelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillDelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
