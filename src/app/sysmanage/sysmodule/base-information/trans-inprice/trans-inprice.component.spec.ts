import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransInpriceComponent } from './trans-inprice.component';

describe('TransInpriceComponent', () => {
  let component: TransInpriceComponent;
  let fixture: ComponentFixture<TransInpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransInpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransInpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
