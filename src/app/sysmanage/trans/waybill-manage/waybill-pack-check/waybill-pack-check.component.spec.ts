import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillPackCheckComponent } from './waybill-pack-check.component';

describe('WaybillPackCheckComponent', () => {
  let component: WaybillPackCheckComponent;
  let fixture: ComponentFixture<WaybillPackCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillPackCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillPackCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
