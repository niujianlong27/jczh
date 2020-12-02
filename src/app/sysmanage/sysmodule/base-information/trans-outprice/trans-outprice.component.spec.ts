import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransOutpriceComponent } from './trans-outprice.component';

describe('TransOutpriceComponent', () => {
  let component: TransOutpriceComponent;
  let fixture: ComponentFixture<TransOutpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransOutpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransOutpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
