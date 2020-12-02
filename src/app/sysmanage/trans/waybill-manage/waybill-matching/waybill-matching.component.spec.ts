import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillMatchingComponent } from './waybill-matching.component';

describe('WaybillMatchingComponent', () => {
  let component: WaybillMatchingComponent;
  let fixture: ComponentFixture<WaybillMatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
