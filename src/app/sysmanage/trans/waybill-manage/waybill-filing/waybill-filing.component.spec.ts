import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillFilingComponent } from './waybill-filing.component';

describe('WaybillFilingComponent', () => {
  let component: WaybillFilingComponent;
  let fixture: ComponentFixture<WaybillFilingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillFilingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillFilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
