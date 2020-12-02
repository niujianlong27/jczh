import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillImportComponent } from './waybill-import.component';

describe('WaybillImportComponent', () => {
  let component: WaybillImportComponent;
  let fixture: ComponentFixture<WaybillImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
