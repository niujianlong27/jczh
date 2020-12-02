import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateFundsSettleComponent } from './allocate-funds-settle.component';

describe('AllocateFundsSettleComponent', () => {
  let component: AllocateFundsSettleComponent;
  let fixture: ComponentFixture<AllocateFundsSettleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateFundsSettleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateFundsSettleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
