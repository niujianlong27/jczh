import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnWaybillComponent } from './return-waybill.component';

describe('ReturnWaybillComponent', () => {
  let component: ReturnWaybillComponent;
  let fixture: ComponentFixture<ReturnWaybillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnWaybillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnWaybillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
