import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillAddComponent } from './waybill-add.component';

describe('WaybillAddComponent', () => {
  let component: WaybillAddComponent;
  let fixture: ComponentFixture<WaybillAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
