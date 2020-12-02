import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillNewComponent } from './waybill-new.component';

describe('WaybillNewComponent', () => {
  let component: WaybillNewComponent;
  let fixture: ComponentFixture<WaybillNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
