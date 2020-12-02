import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransFeeComponent } from './trans-fee.component';

describe('TransFeeComponent', () => {
  let component: TransFeeComponent;
  let fixture: ComponentFixture<TransFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
