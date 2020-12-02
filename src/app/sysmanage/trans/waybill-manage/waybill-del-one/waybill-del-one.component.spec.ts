import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillDelOneComponent } from './waybill-del-one.component';

describe('WaybillDelOneComponent', () => {
  let component: WaybillDelOneComponent;
  let fixture: ComponentFixture<WaybillDelOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillDelOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillDelOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
