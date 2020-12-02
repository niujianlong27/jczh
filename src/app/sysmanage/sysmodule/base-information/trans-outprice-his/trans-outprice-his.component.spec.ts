import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransOutpriceHisComponent } from './trans-outprice-his.component';

describe('TransOutpriceHisComponent', () => {
  let component: TransOutpriceHisComponent;
  let fixture: ComponentFixture<TransOutpriceHisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransOutpriceHisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransOutpriceHisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
