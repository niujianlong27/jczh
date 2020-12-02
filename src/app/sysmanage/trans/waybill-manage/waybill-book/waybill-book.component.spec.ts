import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillBookComponent } from './waybill-book.component';

describe('WaybillBookComponent', () => {
  let component: WaybillBookComponent;
  let fixture: ComponentFixture<WaybillBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
